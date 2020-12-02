package main;

import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Random;

import com.sun.org.apache.bcel.internal.generic.POP;

import java.util.Map.Entry;

import weka.classifiers.Classifier;
import weka.classifiers.Evaluation;
import weka.core.Instance;
import weka.core.Instances;

public class MePSO extends BaseAlgorithm {

	private class Bird extends Individual {
		private double[] velocity;
		public double maxVelo;
		public double minVelo;
		public double weight;
		public double distance;
		public double difFitness;
		
		public double [] pbestPosition;
		public double pFitness;
		
		public Bird()
		{
			super();
			velocity = new double[1]; 
		}
		
		public Bird(int numDim, double min, double max, double weight, double vmaxFactor)
		{
			super(numDim, min, max);
			velocity = new double[numDim];
			pbestPosition = new double [numDim];
			maxVelo = vmaxFactor * max;
			minVelo = -maxVelo;
			this.weight = weight;
		}
		
		@Override
		public void initialize(Random rnd)
		{
			super.initialize(rnd);
			
			for (int i = 0; i < position.length; i++)
			{
				velocity[i] = minVelo + rnd.nextDouble() * (maxVelo - minVelo);
				pbestPosition[i] = position[i];
			}
			
			pFitness = Double.NaN;
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
		
		public double computeDistanceToBest(Individual bestBird) {
			double sum = 0;
			for (int i = 0; i < position.length; i++) {
				sum += (position[i] - bestBird.getPosition(i)) * (position[i] - bestBird.getPosition(i));
			}
			
			distance = Math.sqrt(sum);
			
			return distance;
		}
		
		public void updatePBest() {
			if (isBetter(fitness, pFitness)) {
				pFitness = fitness;
				pbestPosition = Arrays.copyOf(position, position.length);
			}
		}
	}
	
	private final String fileName = "BaseConfig.txt";
	private final String fileMePSO = "MePSOConfig.txt";
	
	private double WeightInit;
	private double WeightFinal;
	private double c1;
	private double c2;
	private double DELTA;
	
	private Bird[] SWARM;
	
	private int iter = 0;
	
	double bestValue;
	
	ArrayList<Integer> MentorId;
	
	public MePSO(int numDim) {
		super();
		NUM_DIMENSIONS = numDim;
		readFileConfig();
		DELTA = (WeightInit - WeightFinal) / MAX_ITER;
		SWARM = new Bird[POPULATION_SIZE];
		iter = 0;
		BestIsMax = true;
		MentorId = new ArrayList<Integer>();
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
		
		filePath = Paths.get(fullPath, fileMePSO);
		try {
		      ArrayList<String> lines = (ArrayList<String>) Files.readAllLines(filePath, Charset.forName("UTF-8"));

		      WeightInit = Double.parseDouble(lines.get(0).replaceAll("[\\s+a-zA-Z :_]", ""));
		      WeightFinal = Double.parseDouble(lines.get(1).replaceAll("[\\s+a-zA-Z :_]", ""));
		      c1 = Double.parseDouble(lines.get(2).replaceAll("[\\s+a-zA-Z :_]", ""));
		      c2 = Double.parseDouble(lines.get(3).replaceAll("[\\s+a-zA-Z :_]", ""));
		    } catch (IOException e) {
		      System.out.println(e);
		    }
	}
	
	private void initialize(int numDim, double min, double max) {
		for (int individualId = 0; individualId < POPULATION_SIZE; individualId++) {
			SWARM[individualId] = new Bird(numDim, min, max, WeightInit, VMAX_FACTOR);
			SWARM[individualId].initialize(rnd);
			SWARM[individualId].calculatePhenotype(rnd);	
		}
		best = new Bird(numDim, min, max, WeightInit, VMAX_FACTOR);
		best.setFitness(Double.NaN);
	}
	
	public void updateMentor(int id) {
		if (SWARM[id].fitness == best.fitness) {
			SWARM[id].weight += DELTA;
			for (int j = 0; j < NUM_DIMENSIONS; j++) {
				SWARM[id].velocity[j] = SWARM[id].weight * SWARM[id].velocity[j];
				SWARM[id].handleOutOfBoundVelocity(j);
				SWARM[id].setPosition(j, SWARM[id].position[j] + SWARM[id].velocity[j]);
				SWARM[id].handleOutOfBoundPosition(j);
			}
		}
		else {
			SWARM[id].weight -= DELTA;
			for (int j = 0; j < NUM_DIMENSIONS; j++) {
				SWARM[id].velocity[j] = SWARM[id].weight * SWARM[id].velocity[j] + c1 * rnd.nextDouble() * (SWARM[id].pbestPosition[j] - SWARM[id].position[j]) + c2 * rnd.nextDouble() * 0.5 * (best.position[j] - SWARM[id].position[j]);
				SWARM[id].handleOutOfBoundVelocity(j);
				SWARM[id].setPosition(j, SWARM[id].position[j] + SWARM[id].velocity[j]);
				SWARM[id].handleOutOfBoundPosition(j);
			}
		}
		SWARM[id].calculatePhenotype(rnd);
	}
	
	public void updateMentee(int id) {
		int k = -1;
		if (MentorId.size() > 0)
			k = rnd.nextInt(MentorId.size());
		
		SWARM[id].weight -= DELTA;
		for (int j = 0; j < NUM_DIMENSIONS; j++) {
			int cse = 0;
			if (rnd.nextDouble() < 0.5) {
				cse = 1;
			}
			
			if (cse == 1) {
				SWARM[id].velocity[j] = SWARM[id].weight * SWARM[id].velocity[j] + c1 * rnd.nextDouble() * (SWARM[id].pbestPosition[j] - SWARM[id].position[j]);
			}
			else {
				if (k != -1)
					SWARM[id].velocity[j] = SWARM[id].weight * SWARM[id].velocity[j] + c2 * rnd.nextDouble() * (SWARM[MentorId.get(k)].position[j] - SWARM[id].position[j]);
				else
					SWARM[id].velocity[j] = SWARM[id].weight * SWARM[id].velocity[j] + c2 * rnd.nextDouble() * (best.position[j] - SWARM[id].position[j]);
			}
			SWARM[id].handleOutOfBoundVelocity(j);
			SWARM[id].setPosition(j, SWARM[id].position[j] + SWARM[id].velocity[j]);
			SWARM[id].handleOutOfBoundPosition(j);
		}
		SWARM[id].calculatePhenotype(rnd);
	}
	
	public void updateIndependent(int id) {
		SWARM[id].weight -= DELTA;
		for (int j = 0; j < NUM_DIMENSIONS; j++) {
			double psoj = 0;
			if (rnd.nextDouble() > 0.5)
				psoj = 1;
			SWARM[id].velocity[j] = SWARM[id].weight * SWARM[id].velocity[j] + c1 * rnd.nextDouble() * (SWARM[id].pbestPosition[j] - SWARM[id].position[j]) + c2 * rnd.nextDouble() * psoj * (best.position[j] - SWARM[id].position[j]);
			SWARM[id].handleOutOfBoundVelocity(j);
			SWARM[id].setPosition(j, SWARM[id].position[j] + SWARM[id].velocity[j]);
			SWARM[id].handleOutOfBoundPosition(j);
		}
		SWARM[id].calculatePhenotype(rnd);
	}
	
	@Override
	public Individual run(Instances training, Instances testing, Classifier predictor, ArrayList<Entry<Integer, Integer>> majority, int minIndex, int maxIndex) {
		initialize(NUM_DIMENSIONS, MIN_VAL, MAX_VAL);
		ArrayList<Integer> MenteeId = new ArrayList<Integer>();
		ArrayList<Integer> IndepenceId = new ArrayList<Integer>();
		MentorId = new ArrayList<Integer>();
		iter = 0;
		while (iter <= MAX_ITER) {
			// compute fitness
			for (int i = 0; i < POPULATION_SIZE; i++)
			{
				SWARM[i].computeFitness(training, testing, predictor, majority, minIndex, maxIndex);
				SWARM[i].updatePBest();
				if (isBetter(SWARM[i].fitness, best.fitness)) {
					best.setPosition(SWARM[i].getPosition());
					best.setFitness(SWARM[i].getFitness());
					best.setPhenotype(SWARM[i].phenotype);
				}
			}
			
			if (iter < MAX_ITER) {
				double[] ThresDifFit = new double [POPULATION_SIZE];
				double[] ThresDifDistance = new double[POPULATION_SIZE];
				for (int i = 0; i < POPULATION_SIZE; i++) {
					SWARM[i].difFitness = Math.abs(best.fitness - SWARM[i].fitness);
					SWARM[i].computeDistanceToBest(best);
					
					ThresDifFit[i] = SWARM[i].difFitness;
					ThresDifDistance[i] = SWARM[i].distance;
				}
				
				Arrays.sort(ThresDifFit);
				Arrays.sort(ThresDifDistance);
				
				double thresMentorFit = ThresDifFit[(int)(0.1 * POPULATION_SIZE)];
				double thresMentorDistance = ThresDifDistance[(int)(0.4 * POPULATION_SIZE)];
				double thresMenteeFit = ThresDifFit[(int)(0.9 * POPULATION_SIZE)];
				double thresMenteeDistance = ThresDifDistance[(int)(0.7 * POPULATION_SIZE)];
				// Divide groups
				// Find MentorId goups
				MentorId.clear();
				MenteeId.clear();
				IndepenceId.clear();
				
				for (int i = 0; i < POPULATION_SIZE; i++) {
					if (SWARM[i].difFitness <= thresMentorFit && SWARM[i].distance <= thresMentorDistance)
					{
						MentorId.add(i);
					}
					else if (SWARM[i].difFitness > thresMenteeFit && SWARM[i].distance >= thresMenteeDistance) {
						MenteeId.add(i);
					}
					else {
						IndepenceId.add(i);
					}
				}
				
				//System.out.println(MentorId.size());
				for (int i = 0; i < MentorId.size(); i++) {
					updateMentor(MentorId.get(i));
				}
				
				for (int i = 0; i < MenteeId.size(); i++) {
					updateMentee(MenteeId.get(i));
				}
				
				for (int i = 0; i < IndepenceId.size(); i++) {
					updateIndependent(IndepenceId.get(i));
				}
			}
			
			++iter;
		}
		
		return best;
	}
}
