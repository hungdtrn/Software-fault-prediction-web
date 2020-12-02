package main;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Random;
import java.util.Map.Entry;
import java.util.function.Function;

import weka.classifiers.Classifier;
import weka.core.Instances;

public abstract class BaseAlgorithm {
	public int POPULATION_SIZE;
	public int NUM_DIMENSIONS;
	public int MAX_ITER;
	public double MIN_VAL;
	public double MAX_VAL;
	public double VMAX_FACTOR;
	
	public Individual best;
	public Individual worst;
	
	protected Random rnd;

	//Giá trị quy định giá trị fitness càng lớn càng tốt hay càng nhỏ càng tốt
	protected boolean BestIsMax;

	public double [] straCounter;
	
	public BaseAlgorithm()
	{
		rnd = new Random();
		best = new Individual();
		worst = new Individual();
	}
	
	public void setData(int popSize, int numDim, int maxIter, double min, double max) {
		POPULATION_SIZE = popSize;
		NUM_DIMENSIONS = numDim;
		MAX_ITER = maxIter;
		MIN_VAL = min;
		MAX_VAL = max;
	}
	
	//Trả về vị trí của cá thể có giá trị fitness nhỏ nhất
	protected int getOneWithMinValue(Individual[] population) {
		double min = population[0].getFitness();
		int minId = 0;
		
		for (int i = 1; i < population.length; i++) {
			double currentValue = population[i].getFitness();
			
			if (currentValue < min) {
				min = currentValue;
				minId = i;
			}
		}
			
		return minId;
	}
	
	//Trả về vị trí của cá thể có giá trị fitness lớn nhất
	protected int getOneWithMaxValue(Individual[] population) {
		double max = population[0].getFitness();
		int maxId = 0;
		
		for (int i = 1; i < population.length; i++) {
			double currentValue = population[i].getFitness();
			
			if (currentValue > max) {
				max = currentValue;
				maxId = i;
			}
		}
			
		return maxId;
	}
	
	
	//Trả về vị trí của cá thể có giá trị fitness nhỏ nhất, vị trí này không được nằm trong excludeId
	protected int getOneWithMinValue(Individual[] population, List<Integer> excludeId) {
		double min = Double.MAX_VALUE;
		int minId = -1;
		
		for (int i = 0; i < population.length; i++) {
			if (excludeId.contains(i))
				continue;
			
			double currentValue = population[i].getFitness();
			if (currentValue < min || minId == -1) {
				min = currentValue;
				minId = i;
			}
		}
		
		return minId;
	}
	
	//Trả về vị trí của cá thể có giá trị fitness lớn nhất, vị trí này không được nằm trong excludeId
	protected int getOneWithMaxValue(Individual[] population, List<Integer> excludeId) {
		double max = Double.MIN_VALUE;
		int maxId = -1;
		
		for (int i = 0; i < population.length; i++) {
			if (excludeId.contains(i))
				continue;
			
			double currentValue = population[i].getFitness();
			if (currentValue > max || maxId == -1) {
				max = currentValue;
				maxId = i;
			}
		}
		
		return maxId;
	}
	
	protected Individual[] sortIncreasing(Individual[] population) {
		Arrays.sort(population, new Comparator<Individual>() {

			@Override
			public int compare(Individual o1, Individual o2) {
				if (o1.getFitness() > o2.getFitness()) {
					return 1;
				} else if (o1.getFitness() == o2.getFitness()) {
					return 0;
				} else {
					return -1;
				}
			}
			
		});
		
		return population;
	}
	
	protected Individual[] sortDecreasing(Individual[] population) {
		Arrays.sort(population, new Comparator<Individual>() {

			@Override
			public int compare(Individual o1, Individual o2) {
				// TODO Auto-generated method stub
				if (o2.getFitness() > o1.getFitness()) {
					return 1;
				} else if (o2.getFitness() == o1.getFitness()) {
					return 0;
				} else {
					return -1;
				}
			}
		});
		
		return population;
	}
	
	protected int getBest(Individual[] population) {
		if (BestIsMax)
			return getOneWithMaxValue(population);
		else
			return getOneWithMinValue(population);
	}
	
	protected int getWorst(Individual[] population) {
		if (BestIsMax)
			return getOneWithMinValue(population);
		else
			return getOneWithMaxValue(population);
	}
	
	public abstract Individual run(Instances training, Instances testing, Classifier predictor,  ArrayList<Entry<Integer, Integer>> majority, int minIndex, int maxIndex);
	
	protected boolean isBetter(double a, double b) {
		//return if a is better than b
		return (BestIsMax && (a >= b)) || (!BestIsMax && (a <= b)) || Double.isNaN(b);
	}
	
	protected boolean isWorse(double a, double b) {
		//return if a is worse than b
		return (BestIsMax && (a < b)) || (!BestIsMax && (a > b)) || Double.isNaN(b);
	}
	
	protected class SourceTmp {
		public double fitness;
		public boolean isFirstArray;
		public int index;
		
		public SourceTmp(double _fitness, boolean _isFirstArray, int _index) {
			fitness = _fitness;
			isFirstArray = _isFirstArray;
			index = _index;
		}
		
		public SourceTmp(SourceTmp tmp) {
			fitness = tmp.fitness;
			isFirstArray = tmp.isFirstArray;
			index = tmp.index;
		}
	}
	
	public SourceTmp[] sortDescendingSourceTmp(SourceTmp[] population)
	{
		Arrays.sort(population, new Comparator<SourceTmp>() {
			
			@Override
			public int compare(SourceTmp arg0, SourceTmp arg1) {
				if (arg0.fitness > arg1.fitness) {
					return 1;
				} else if (arg0.fitness == arg1.fitness) {
					return 0;
				} else {
					return -1;
				}
			}
			
		});
		
		return population;
	}
	
	public SourceTmp[] sortAsendingSourceTmp(SourceTmp[] population) {
			Arrays.sort(population, new Comparator<SourceTmp>() {
			
			@Override
			public int compare(SourceTmp arg0, SourceTmp arg1) {
				if (arg0.fitness < arg1.fitness) {
					return 1;
				} else if (arg0.fitness == arg1.fitness) {
					return 0;
				} else {
					return -1;
				}
			}
			
		});
		
		return population;
	}
}
