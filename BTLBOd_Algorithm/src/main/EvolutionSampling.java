package main;

import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Map.Entry;

import weka.classifiers.Classifier;
import weka.classifiers.functions.SMO;
import weka.classifiers.lazy.IBk;
import weka.classifiers.trees.J48;
import weka.core.Attribute;
import weka.core.Instance;
import weka.core.Instances;
import weka.core.converters.ConverterUtils.DataSource;

public class EvolutionSampling {
	public Instances originalTrainingInstances;
	
	public String trainingFile;
	public int numFolds;
	
	public ArrayList<boolean[]> bestDataSet;
	int minIndex;
	int maxIndex;
	int numMinorityClass;
	
	public Instances balancedInstance;
	
	public EvolutionSampling(int fold, String trainFile) {
		this.trainingFile = trainFile;
		numFolds = fold;
		bestDataSet = new ArrayList<boolean[]>();
		minIndex = 0;
		maxIndex = 0;
		numMinorityClass = 0;
	}
	
	public void readDataSet() throws Exception {
		DataSource source = new DataSource("Dataset/" + trainingFile);
		originalTrainingInstances = source.getDataSet();
		originalTrainingInstances.insertAttributeAt(new Attribute("ID"), 0);
		
		for (int i = 0; i < originalTrainingInstances.numInstances(); i++) {
			originalTrainingInstances.instance(i).setValue(0, i);
		}
		
		originalTrainingInstances.setClassIndex(originalTrainingInstances.numAttributes() - 1);
		
		// determine minClass and maxClass of training
		int min = Integer.MAX_VALUE;
		int max = Integer.MIN_VALUE;
		int[] classCounts = originalTrainingInstances.attributeStats(originalTrainingInstances.classIndex()).nominalCounts;
		for (int i = 0; i < classCounts.length; i++) {
			if (classCounts[i] != 0 && classCounts[i] < min) {
				min = classCounts[i];
				minIndex = i;
			}
			if (classCounts[i] != 0 && classCounts[i] > max) {
				max = classCounts[i];
				maxIndex = i;
			}
		}
		
		numMinorityClass = min;
	}
	
	public Instances evolvingSampling(int selectAlgo) throws Exception {
		readDataSet();
		
		for (int fold = 0; fold < numFolds; fold++) {
			Instances training_fold = originalTrainingInstances.trainCV(numFolds, fold);
			Instances testing_fold = originalTrainingInstances.testCV(numFolds, fold);
			
			// create list of index-id of majority class and minority class of training fold
			// Create a temporary majority list
			ArrayList<Entry<Integer, Integer>> majority = new ArrayList<Entry<Integer, Integer>>();

			// Add majority instantes to the majority list
			for (int i = 0; i < training_fold.size(); i++) {
				if ((int) training_fold.instance(i).classValue() == maxIndex) {
					Entry<Integer, Integer> pair = new AbstractMap.SimpleEntry<> (i, (int)training_fold.instance(i).value(0));
					majority.add(pair);
				}
			}
			// delete ID field
			training_fold.deleteAttributeAt(0);
			training_fold.setClassIndex(training_fold.numAttributes() - 1);
			testing_fold.deleteAttributeAt(0);
			testing_fold.setClassIndex(testing_fold.numAttributes() - 1);
			
			Classifier predictor = new SMO();
			BaseAlgorithm opti;
			
			if (selectAlgo == 0)
				opti = new SocialLearningPSO(majority.size());
			else if (selectAlgo == 1)
				opti = new MePSO(majority.size());
			else if (selectAlgo == 2)
				opti = new BTLBOAlgorithm(majority.size());
			else if (selectAlgo == 3)
				opti = new GBTLBOAlgorithm(majority.size());
			else
				opti = new NGBTLBOAlgorithm(majority.size());
			
			Individual bestInd = opti.run(training_fold, testing_fold, predictor, majority, minIndex, maxIndex);
			
			// save the best set of training data using id
			boolean[] saveBestId = new boolean [originalTrainingInstances.size()];
			for (int i = 0; i < saveBestId.length; i++) {
				saveBestId[i] = false;
			}
			for (int i = 0; i < bestInd.phenotype.length; i++) {
				if (bestInd.phenotype[i] == true) {
					saveBestId[majority.get(i).getValue()] = true;
				}
			}
			
			bestDataSet.add(saveBestId);
		}
		
		rankingSelection();
		
		return balancedInstance;
	}
	
	private class TmpData{
		int index;
		int counter;
	}
	
	// ranking dataset results
	public void rankingSelection() {
		TmpData [] counter = new TmpData [originalTrainingInstances.size()];
		for (int i = 0; i < counter.length; i++) {
			counter[i] = new TmpData();
			counter[i].index = i;
			counter[i].counter = 0;
		}
		
		for (boolean[] bestData : bestDataSet) {
			for (int j = 0; j < bestData.length; j++) {
				if (bestData[j] == true) {
					++(counter[j].counter);
				}
			}
		}
		
		Comparator<TmpData> comparator = new Comparator<EvolutionSampling.TmpData>() {
			@Override
			public int compare(TmpData o1, TmpData o2) {
				if (o2.counter > o1.counter)
					return 1;
				else if (o2.counter == o1.counter)
					return 0;
				else return -1;
			}
		};
		
		// sort descending
		Arrays.sort(counter, comparator);
		
		// keep numMinorityClass instances for majority class
		ArrayList<Integer> keepMajorityClass = new ArrayList<Integer>();
		for (int i = 0; i < numMinorityClass; i++) {
			keepMajorityClass.add(counter[i].index);
		}
		
		// build the optimized balanced datasets
		balancedInstance = new Instances(originalTrainingInstances, 0);
		
		for (int i = 0; i < originalTrainingInstances.size(); i++) {
			if (((int) originalTrainingInstances.get(i).classValue() == minIndex)
					|| ((int) originalTrainingInstances.get(i).classValue() == maxIndex && keepMajorityClass.contains(i))) {
				balancedInstance.add((Instance)originalTrainingInstances.get(i).copy());
			}
		}
		
		balancedInstance.deleteAttributeAt(0);
		balancedInstance.setClassIndex(balancedInstance.numAttributes() - 1);
	}
}
