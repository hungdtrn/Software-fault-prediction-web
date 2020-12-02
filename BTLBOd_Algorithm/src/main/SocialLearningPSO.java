package main;

import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Random;
import java.util.Map.Entry;
import java.util.function.Function;

import weka.classifiers.Classifier;
import weka.classifiers.Evaluation;
import weka.classifiers.evaluation.ThresholdCurve;
import weka.core.Instance;
import weka.core.Instances;


public class SocialLearningPSO extends BaseAlgorithm {
	private class Bird extends Individual {
		private double[] velocity;
		public double maxVelo;
		public double minVelo;
		
		public Bird()
		{
			super();
			velocity = new double[1]; 
		}
		
		public Bird(int numDim, double min, double max, double vmaxfactor)
		{
			super(numDim, min, max);
			velocity = new double[numDim];
			maxVelo = vmaxfactor * max;
			minVelo = -maxVelo;
		}
		
		@Override
		public void initialize(Random rnd)
		{
			super.initialize(rnd);
			
			for (int i = 0; i < position.length; i++)
			{
				velocity[i] = minVelo + rnd.nextDouble() * (maxVelo - minVelo);
			}
		}
		
		public void setMaxVelo(double maxV) {
			maxVelo = maxV;
			minVelo = -maxVelo;
		}
		
		public void handleOutOfBoundVelocity() {
			for (int id = 0; id < velocity.length; id++) {
				double value = velocity[id];
				
				if (value > maxVelo || value < minVelo) {
					value = minVelo + Math.abs(value) % (maxVelo - minVelo);
				}
				
//				if (value > maxVelo)
//					value = maxVelo;
//				if (value < minVelo) 
//					value = minVelo;
				
				velocity[id] = value;
			}
		}
		
		public void handleOutOfBoundVelocity(int id) {
			double value = velocity[id];
			
			if (value > maxVelo || value < minVelo) {
				value = minVelo + Math.abs(value) % (maxVelo - minVelo);
			}
			
//			if (value > maxVelo)
//				value = maxVelo;
//			if (value < minVelo) 
//				value = minVelo;
			
			velocity[id] = value;
		}
		
		public double getVelocity(int id) {
			return velocity[id];
		}
		
		public void setVelocity(int id, double value) {
			velocity[id] = value;
		}
		
		public void setVelocity(double[] newVelocity) {
			velocity = newVelocity;
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
	
	private double ALPHA = 0.5;
	private double BETA = 0.01;
	private double GAMMA;

	private Bird[] SWARM;
	private double[] P;
	
	private double[] MEAN_INDIVIDUAL;
	
	private int iter = 0;
	
	double bestValue;
	
	public SocialLearningPSO(int numDim) {
		super();
		NUM_DIMENSIONS = numDim;
		readFileConfig();
		GAMMA = BETA * (NUM_DIMENSIONS * 1.0 / POPULATION_SIZE);
		SWARM = new Bird[POPULATION_SIZE];
		P = new double[POPULATION_SIZE];
		MEAN_INDIVIDUAL = new double[NUM_DIMENSIONS];
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
	}
	
	private void initialize(int numDim, double min, double max) {
		for (int individualId = 0; individualId < POPULATION_SIZE; individualId++) {
			SWARM[individualId] = new Bird(numDim, min, max, VMAX_FACTOR);
			SWARM[individualId].initialize(rnd);
			SWARM[individualId].calculatePhenotype(rnd);
			
			P[individualId] = 1 - (individualId - 1) * 1.0 / POPULATION_SIZE;

			P[individualId] = Math.pow(P[individualId], ALPHA * Math.log (Math.ceil((NUM_DIMENSIONS * 1.0) / POPULATION_SIZE)));
			
		}
		best = new Bird(numDim, min, max, VMAX_FACTOR);
		best.setFitness(Double.NaN);
		
		updateMean();
	}
	
	private void updateAllPositions(int individualId) {
		double flagValues = rnd.nextDouble();
		boolean isToBeUpdated = flagValues <= P[individualId];

		if (isToBeUpdated) {
			for (int attrId = 0; attrId < NUM_DIMENSIONS; attrId++) {
				updateVelocity(individualId, attrId);
				updatePosition(individualId, attrId);
			}
			SWARM[individualId].calculatePhenotype(rnd);
		}
	}
	
	private void updateVelocity(int individualId, int attrId) {
		int k = individualId + 1 + rnd.nextInt(POPULATION_SIZE - (individualId + 1));
		double I = SWARM[k].getPosition(attrId) - SWARM[individualId].getPosition(attrId);
		double C = MEAN_INDIVIDUAL[attrId] - SWARM[individualId].getPosition(attrId);
		
		double currentV = SWARM[individualId].getVelocity(attrId);
		
		double r1 = rnd.nextDouble(), r2 = rnd.nextDouble(), r3 = rnd.nextDouble();
		
		SWARM[individualId].setVelocity(attrId, r1 * currentV + r2 * I + r3 * GAMMA * C);
		SWARM[individualId].handleOutOfBoundVelocity(attrId);
	}
	
	private void updatePosition(int individualId, int attributeId) {
		double currentPosition = SWARM[individualId].getPosition(attributeId);
		double currentVelocity = SWARM[individualId].getVelocity(attributeId);
		double newPosition = currentPosition + currentVelocity;
		
		SWARM[individualId].setPosition(attributeId,  newPosition);
		SWARM[individualId].handleOutOfBoundPosition(attributeId);
	}
	
	private void updateMean() {
		for (int attributeId = 0; attributeId < NUM_DIMENSIONS; attributeId++) {
			MEAN_INDIVIDUAL[attributeId] = 0;
		}
		
		for (int individualId = 0; individualId < POPULATION_SIZE; individualId++) {
			for (int attributeId = 0; attributeId < NUM_DIMENSIONS; attributeId++) {
				MEAN_INDIVIDUAL[attributeId] += SWARM[individualId].getPosition(attributeId) / POPULATION_SIZE;
			}
		}
	}
	
	@Override
	public Individual run(Instances training, Instances testing, Classifier predictor, ArrayList<Entry<Integer, Integer>> majority, int minIndex, int maxIndex)
	{
		initialize(NUM_DIMENSIONS, MIN_VAL, MAX_VAL);
		
		while (iter < MAX_ITER) {
			for (int i = 0; i < POPULATION_SIZE; i++)
			{
				SWARM[i].computeFitness(training, testing, predictor, majority, minIndex, maxIndex);
			}
			
			if (BestIsMax)
				SWARM = (Bird[]) sortIncreasing(SWARM);
			else
				SWARM = (Bird[]) sortDecreasing(SWARM);
								
			if (isBetter(SWARM[POPULATION_SIZE-1].getFitness(), best.getFitness())) {
				best.setPosition(SWARM[POPULATION_SIZE-1].getPosition());
				best.setFitness(SWARM[POPULATION_SIZE-1].getFitness());
				best.setPhenotype(SWARM[POPULATION_SIZE-1].phenotype);
				//System.out.println(best.getFitness());
			} 
			
			for (int individualId = 0; individualId < POPULATION_SIZE - 1; individualId++) {
				updateAllPositions(individualId);
			}
			
			updateMean();
			++iter;
		}
		
		return best;
	}
}
