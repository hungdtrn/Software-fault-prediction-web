package main;

import java.util.Random;

import weka.core.DenseInstance;
import weka.core.EuclideanDistance;
import weka.core.Instance;
import weka.core.Instances;
import weka.core.neighboursearch.LinearNNSearch;

public class SMOTE {
	 /** The number of neighbors to consider during each synthetic example generation */
	  protected int m_smoteNeighbors = 5;
	  /** The number of minority examples to generate, as a percentage of the number of provided minority examples */
	  protected double m_MinoritySamplesToGenerate = 1.0;
	  
	  /**
	   * Gets the number of minority examples to generate, as a percentage of the number of provided minority examples.
	   *
	   * @return the number of minority examples to generate, as a percentage.
	   */
	  public double getMinoritySamplesToGenerate()
	  {
	    return m_MinoritySamplesToGenerate;
	  }
	  
	  /**
	   * Sets the number of minority examples to generate, as a percentage of the number of provided minority examples.
	   *
	   * @param newMinoritySamplesToGenerate the number of minority examples to generate, as a percentage.
	   */
	  public void setMinoritySamplesToGenerate(double newMinoritySamplesToGenerate)
	  {
	    m_MinoritySamplesToGenerate = newMinoritySamplesToGenerate;
	  }
	  
	  /**
	   * Sets the number of neighbors to consider during each synthetic example generation.
	   *
	   * @param newSmoteNeighbors the number of neighbors to consider.
	   */
	  public void setSmoteNeighbors(int newSmoteNeighbors)
	  {
	    m_smoteNeighbors = newSmoteNeighbors;
	  }
	  
	  /**
	   * Gets the number of neighbors to consider during each synthetic example generation.
	   *
	   * @return the number of neighbors to consider.
	   */
	  public int getSmoteNeighbors()
	  {
	    return m_smoteNeighbors;
	  }
	  
	  /** When set to true the SMOTE function will check generated examples are not nearest neighbors to majority class examples */
	  protected boolean m_syntheticExampleProtection = false;
	  
	  /**
	   * Gets if SMOTE is checking for majority class examples near generated instances.
	   *
	   * @return true if synthetic example protection is on.
	   */
	  public boolean getSyntheticExampleProtection()
	  {
	    return m_syntheticExampleProtection;
	  }
	  
	  /**
	   * Sets if SMOTE is checking for majority class examples near generated instances.
	   *
	   * @param newSyntheticExampleProtection set to true to turn synthetic example protection on.
	   */
	  public void setSyntheticExampleProtection(boolean newSyntheticExampleProtection)
	  {
	    m_syntheticExampleProtection = newSyntheticExampleProtection;
	  }
	  
	  /** When set to true the SMOTE function will randomly select a neighbor per attribute instead of one per instance to generate a new synthetic instance */
	  protected boolean m_neighborPerAttribute = false;
	  
	  /**
	   * Gets if SMOTE is using a random neighbor per attribute to generate instances.
	   *
	   * @return true if neighbor per attribute is on.
	   */
	  public boolean getNeighborPerAttribute()
	  {
		  return m_neighborPerAttribute;
	  }
	  
	  /**
	   * Sets if SMOTE is using a random neighbor per attribute to generate instances.
	   *
	   * @param newNeighborPerAttribute set to true to turn neighbor per attribute on.
	   */
	  public void setNeighborPerAttribute(boolean newNeighborPerAttribute)
	  {
		  m_neighborPerAttribute = newNeighborPerAttribute;
	  }
	  
	  private Instance smoteExampleGenerator(Instance minorityInstance, Instances kNearestMinorityNeighbors, Random random)
	  {
	      Instance randomNeighbor = kNearestMinorityNeighbors.instance(random.nextInt(kNearestMinorityNeighbors.numInstances()));
	      
	      double syntheticValues[] = new double[minorityInstance.numAttributes()];
	      
	      for (int i = 0; i < minorityInstance.numAttributes(); i++)
	      {
	          if (m_neighborPerAttribute)
	              randomNeighbor = kNearestMinorityNeighbors.instance(random.nextInt(kNearestMinorityNeighbors.numInstances()));
	          
	          if (Double.isNaN(minorityInstance.value(i)))
	              syntheticValues[i] = randomNeighbor.value(i);
	          else if (Double.isNaN(randomNeighbor.value(i)))
	              syntheticValues[i] = minorityInstance.value(i);
	          else
	          {
	              double newSyntheticValue = (randomNeighbor.value(i) - minorityInstance.value(i)) * random.nextDouble();

	              if (minorityInstance.attribute(i).isNumeric())
	                  syntheticValues[i] = minorityInstance.value(i) + newSyntheticValue;
	              else if (minorityInstance.attribute(i).isNominal())
	                  syntheticValues[i] = Math.round(minorityInstance.value(i) + newSyntheticValue);
	              else
	                  syntheticValues[i] = minorityInstance.value(i);
	          }
	      }
	     
	      return new DenseInstance(1.0, syntheticValues);
	  }
	  
	  private boolean syntheticExampleProtectionPassed(Instance instanceToCheck, Instances kNearestNeighbors)
	  {
	      for (int i = 0; i < kNearestNeighbors.numInstances(); i++)
	          if (instanceToCheck.getClass() != kNearestNeighbors.instance(i).getClass())
	              return false;
	      return true;
	  }
	  
	  public Instances SMOTESampling(Instances data) throws Exception {
			// remove instances with missing class
			data = new Instances(data);
			data.deleteWithMissingClass();
			
			Instances minorityClassInstances = new Instances(data, 0);
			Instances majorityClassInstances = new Instances(data, 0);
			for(int i = 0; i < data.numInstances(); i++)
			{
			      Instance instance = data.instance(i);
			      if (instance.classValue() > 0.0)
			      {
			    	  majorityClassInstances.add(instance);
			      }
			      else
			      {
			    	  minorityClassInstances.add(instance);
			      }
			}
			
			if (minorityClassInstances.numInstances() > majorityClassInstances.numInstances())
			{
			  // swap to make minorityClassInstances the minority class
			  Instances temp = minorityClassInstances;
			  minorityClassInstances = majorityClassInstances;
			  majorityClassInstances = temp;
			}
			
			if (m_MinoritySamplesToGenerate > majorityClassInstances.size() / minorityClassInstances.size() - 1) {
				m_MinoritySamplesToGenerate = majorityClassInstances.size() / minorityClassInstances.size() - 1;
			}
			
			int minoritySamplesToGenerate = (int)Math.round(minorityClassInstances.numInstances() * m_MinoritySamplesToGenerate); // number of minority class examples to generate
			
			if (m_MinoritySamplesToGenerate == -1)
				minoritySamplesToGenerate = majorityClassInstances.numInstances() - minorityClassInstances.numInstances();
			
			Random random = new Random();
			
			Instances smotedData = new Instances(data);
			
			LinearNNSearch minorityNeighborSearch = new LinearNNSearch(minorityClassInstances);
			minorityNeighborSearch.setDistanceFunction(new EuclideanDistance(minorityClassInstances));
			
			//generate the synthetic examples for the minority class
			for(int i = 0; i < minoritySamplesToGenerate; i++)
			{
			    Instance randomMinorityInstance = minorityClassInstances.instance(random.nextInt(minorityClassInstances.numInstances()));
			    Instances kNearestMinorityNeighbors = minorityNeighborSearch.kNearestNeighbours(randomMinorityInstance, m_smoteNeighbors);        
			    Instance generatedInstance = smoteExampleGenerator(randomMinorityInstance, kNearestMinorityNeighbors, random);
			    
			    if (m_syntheticExampleProtection)
			    {
			        LinearNNSearch fullNeighborSearch = new LinearNNSearch(data);
			        fullNeighborSearch.setDistanceFunction(new EuclideanDistance(data));
			        Instances kFullNearestNeighbors = fullNeighborSearch.kNearestNeighbours(generatedInstance, 1);
			        
			        while (!syntheticExampleProtectionPassed(generatedInstance, kFullNearestNeighbors))
			        {
			            System.err.println("redo");
			            randomMinorityInstance = minorityClassInstances.instance(random.nextInt(minorityClassInstances.numInstances()));
			            kNearestMinorityNeighbors = minorityNeighborSearch.kNearestNeighbours(randomMinorityInstance, m_smoteNeighbors);
			            generatedInstance = smoteExampleGenerator(randomMinorityInstance, kNearestMinorityNeighbors, random);
			            kFullNearestNeighbors = fullNeighborSearch.kNearestNeighbours(generatedInstance, 1);
			        }
			            
			        smotedData.add(generatedInstance);
			    }
			    else
			    {
			        smotedData.add(generatedInstance);
			    }
			}
			
			return smotedData;
	  }
	  
}
