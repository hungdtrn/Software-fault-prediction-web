package main;

import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map.Entry;

import weka.classifiers.Classifier;
import weka.classifiers.Evaluation;
import weka.core.Instance;
import weka.core.Instances;

public class GBTLBOAlgorithm extends BaseAlgorithm {

	private class STUDENT extends Individual {
		public STUDENT()
		{
			super();
		}
		
		public STUDENT(int numDim, double min, double max)
		{
			super(numDim, min, max);
		}
		
		@Override
		public void computeFitness(Instances training, Instances testing, Classifier predictor, ArrayList<Entry<Integer, Integer>> majority, int minIndex, int maxIndex) {
			ArrayList<Entry<Integer, Integer>> newMajority = new ArrayList<Entry<Integer, Integer>>();
			for (int i = 0; i < phenotype.length; i++) {
				if (phenotype[i] == true) {
					newMajority.add(majority.get(i));
				}
			}
			// create new training set based on the values of individual
			Instances newTraining = new Instances(training, 0);
			for (int i = 0; i < training.size(); i++) {
				if (((int) training.get(i).classValue() == minIndex)
						|| ((int) training.get(i).classValue() == maxIndex && isExist(newMajority, i))) {
					newTraining.add((Instance)training.get(i).copy());
				}
			}
			
			// create model
			try {
				predictor.buildClassifier(newTraining);
				Evaluation eval = new Evaluation(newTraining);
				eval.evaluateModel(predictor, testing);
				fitness = eval.weightedAreaUnderROC();// (eval.areaUnderROC(0) + eval.areaUnderROC(1)) / 2;
				//fitness = 1 - eval.errorRate();
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	
	private final String fileName = "BaseConfig.txt";
	private STUDENT[] Student;
	private boolean[] MEAN_INDIVIDUAL;
	private double MutationRate;
	private double CrossoverRate;
	private int iter = 0;
	
	public GBTLBOAlgorithm(int numDim) {
		super();
		NUM_DIMENSIONS = numDim;
		readFileConfig();
		
		Student = new STUDENT[POPULATION_SIZE];
		MEAN_INDIVIDUAL = new boolean[NUM_DIMENSIONS];
		iter = 0;
		BestIsMax = true;
	}

	public void readFileConfig()
	{
		Path currentRelativePath = Paths.get("");
		String fullPath = currentRelativePath.toAbsolutePath().toString();
		
		Path filePath = Paths.get(fullPath, fileName);
		
		try {
	      ArrayList<String> lines = (ArrayList<String>) Files.readAllLines(filePath, Charset.forName("UTF-8"));

	      POPULATION_SIZE = Integer.parseInt(lines.get(0).replaceAll("[\\s+a-zA-Z :_]", ""));
	      MAX_ITER = Integer.parseInt(lines.get(1).replaceAll("[\\s+a-zA-Z :_]", ""));
	      MIN_VAL = Double.parseDouble(lines.get(2).replaceAll("[\\s+a-zA-Z :_]", ""));
	      MAX_VAL = Double.parseDouble(lines.get(3).replaceAll("[\\s+a-zA-Z :_]", ""));
	      VMAX_FACTOR = Double.parseDouble(lines.get(4).replaceAll("[\\s+a-zA-Z :_]", ""));
	    } catch (IOException e) {
	      System.out.println(e);
	    }
		
		filePath = Paths.get(fullPath, "GBTLBOConfig.txt");
		try {
			 ArrayList<String> lines = (ArrayList<String>) Files.readAllLines(filePath, Charset.forName("UTF-8"));

		     MutationRate = Double.parseDouble(lines.get(0).replaceAll("[\\s+a-zA-Z :_]", ""));	    
		     CrossoverRate = Double.parseDouble(lines.get(1).replaceAll("[\\s+a-zA-Z :_]", ""));	    
		} catch (IOException e) {
		      System.out.println(e);
		    }
	}
	
	public void updateBest() {
		double bestFit = Student[0].getFitness();
		int indexBest = 0;
		
		for (int i = 1; i < POPULATION_SIZE; i++) {
			if (isBetter(Student[i].getFitness(), bestFit)){
				indexBest = i;
				bestFit = Student[i].getFitness();
			}
		}
		
		best.setFitness(bestFit);
		best.setPhenotype(Student[indexBest].phenotype);
	}
	
	public void updateMean() {
		for (int attributeId = 0; attributeId < NUM_DIMENSIONS; attributeId++) {
			int counterTrue = 0;
			int counterFalse = 0;
			for (int individualId = 0; individualId < POPULATION_SIZE; individualId++) {
				if (Student[individualId].phenotype[attributeId] == true)
					counterTrue++;
				else
					counterFalse++;
			}
			if (counterTrue >= counterFalse)
				MEAN_INDIVIDUAL[attributeId] = true;
			else
				MEAN_INDIVIDUAL[attributeId] = false;
		}
	}
	
	private void initialize(int numDim) {
		for (int individualId = 0; individualId < POPULATION_SIZE; individualId++) {
			Student[individualId] = new STUDENT(numDim, 0, 1);
			Student[individualId].initPhenotype(rnd);
		}
		best = new Individual(numDim, 0, 1);
		best.setFitness(Double.NaN);
		
		updateBest();
		updateMean();
	}
	
	public void teacherPhase(Instances training, Instances testing, Classifier predictor,
			ArrayList<Entry<Integer, Integer>> majority, int minIndex, int maxIndex) {
		for (int i = 0; i < POPULATION_SIZE; i++) {
			boolean[] oldPhenotype = Arrays.copyOf(Student[i].phenotype, Student[i].phenotype.length);
			double oldFit = Student[i].getFitness();
			
			for (int j = 0; j < NUM_DIMENSIONS; j++) {
				boolean tmp;
				if (rnd.nextDouble() < 0.5)
					tmp = best.phenotype[j];
				else
					tmp = MEAN_INDIVIDUAL[j];
				if (rnd.nextDouble() <= MutationRate)
					tmp = !tmp;
				
				if (rnd.nextDouble() < CrossoverRate)
					Student[i].phenotype[j] = tmp;
			}
			
			Student[i].computeFitness(training, testing, predictor, majority, minIndex, maxIndex);
			
			if (isBetter(oldFit, Student[i].getFitness())) {
				Student[i].setPhenotype(oldPhenotype);
				Student[i].setFitness(oldFit);
			}
		}
			
	}
	
	public void learnerPhase(Instances training, Instances testing, Classifier predictor,
			ArrayList<Entry<Integer, Integer>> majority, int minIndex, int maxIndex) {
		for (int i = 0; i < POPULATION_SIZE; i++) {
			boolean[] oldPhenotype = Arrays.copyOf(Student[i].phenotype, Student[i].phenotype.length);
			double oldFit = Student[i].getFitness();
			
			int k = rnd.nextInt(POPULATION_SIZE);
			while (k == i){
				k = rnd.nextInt(POPULATION_SIZE);
			}
			
			for (int j = 0; j < NUM_DIMENSIONS; j++) {
				if (rnd.nextDouble() < 0.5)
					Student[i].phenotype[j] = Student[k].phenotype[j];
				
				if (rnd.nextDouble() <= MutationRate)
					Student[i].phenotype[j] = !Student[i].phenotype[j];
			}
			
			Student[i].computeFitness(training, testing, predictor, majority, minIndex, maxIndex);
			
			if (isBetter(oldFit, Student[i].getFitness())) {
				Student[i].setPhenotype(oldPhenotype);
				Student[i].setFitness(oldFit);
			}
		}
			
	}
	
	@Override
	public Individual run(Instances training, Instances testing, Classifier predictor,
			ArrayList<Entry<Integer, Integer>> majority, int minIndex, int maxIndex) {
		initialize(NUM_DIMENSIONS);
		iter = 0;
		while (iter < MAX_ITER) {
			teacherPhase(training, testing, predictor, majority, minIndex, maxIndex);
			learnerPhase(training, testing, predictor, majority, minIndex, maxIndex);
			updateBest();
			updateMean();
			++iter;
		}
		return best;
	}

}
