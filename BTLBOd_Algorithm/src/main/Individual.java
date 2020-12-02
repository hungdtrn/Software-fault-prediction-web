package main;

import java.util.ArrayList;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.Phaser;
import java.util.Random;
import java.util.function.Function;

import weka.classifiers.Classifier;
import weka.core.Instance;
import weka.core.Instances;

public class Individual {
	protected double[] position;
	public double[][] ranges;
	public double fitness;
	public boolean [] phenotype;
	
	public String toString() {
		String result = "";
		for (int i = 0; i < position.length; i++) {
			result += position[i] + " ";
		}
		return result;
	}
	
	
	public Individual()
	{
		position = new double[1];
		ranges = new double[1][1];
		phenotype = new boolean[1];
	}
	
	public Individual(int numDim, double min, double max) {
		position = new double[numDim];
		phenotype = new boolean[numDim];
		ranges = new double[numDim][2];
		fitness = Double.NaN;
		
		for (double[] i:ranges)
		{
			i[0] = min;
			i[1] = max;
		}
	}
	
	public void calculatePhenotype(Random rnd) {
		for (int i = 0; i < position.length; i++) {
			double pi = (position[i] - ranges[i][0]) / (ranges[i][1] - ranges[i][0]);
			if (rnd.nextDouble() <= pi) {
				phenotype[i] = true;
			}
			else
			{
				phenotype[i] = false;
			}
			
//			double pi = 1.0 / (1 + Math.exp(-position[i]));
//			if (pi < 0.5)
//				phenotype[i] = false;
//			else
//				phenotype[i] = true;
		}
	}
	
	public void initialize(Random random) {
		for (int i = 0; i < position.length; i++)
		{
			position[i] = ranges[i][0] + random.nextDouble() * (ranges[i][1] - ranges[i][0]);
		}
	}
	
	public void initPhenotype(Random rnd) {
		for (int i = 0; i < phenotype.length; i++) {
			if (rnd.nextDouble() < 0.5)
				phenotype[i] = false;
			else
				phenotype[i] = true;
		}
	}
	
	public double[] getPosition() {
		return position.clone();
	}
	
	public double getPosition(int id) {
		return position[id];
	}
	
	public void setPosition(double[] newPosition) {
		for (int i = 0; i < position.length; i++)
		{
			position[i] = newPosition[i];
		}
	}
	
	public void setPhenotype(boolean[] phenotype) {
		for (int i = 0; i < phenotype.length; i++)
		{
			this.phenotype[i] = phenotype[i];
		}
	}
	
	public void setPosition(int id, double value) {
		position[id] = value;
	}
	
	public void handleOutOfBoundPosition() {
		for (int id = 0; id < ranges.length; id++) {
			double min = ranges[id][0];
			double max = ranges[id][1];
			double value = position[id];
			
			if (value > max || value < min) {
				value = min + Math.abs(value) % (max - min);
			}
			
			position[id] = value;
		}
	}
	
	public void handleOutOfBoundPosition(int id) {
		double min = ranges[id][0];
		double max = ranges[id][1];
		double value = position[id];
		
		if (value > max || value < min) {
			value = min + Math.abs(value) % (max - min);
		}
		
		position[id] = value;
	}
	
	public double getFitness() {
		return fitness;
	}
	
	public void setFitness(double newFit) {
		fitness = newFit;
	}
	
	boolean isExist(ArrayList<Entry<Integer, Integer>> list, int key) {
		for (int i = 0; i < list.size(); i++) {
	        if (key == list.get(i).getKey()) {
	           return true;
	        }
		}
		
		return false;
	}
	
	public void computeFitness(Instances training, Instances testing, Classifier predictor, ArrayList<Entry<Integer, Integer>> majority, int minIndex, int maxIndex) {}
	
	public void printValue() {
		for (int i = 0; i < position.length; i++) {
			System.out.print(position[i] + "  ");
		}
	}
}
