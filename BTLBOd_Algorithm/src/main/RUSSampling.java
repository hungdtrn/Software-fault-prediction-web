package main;

import java.util.ArrayList;
import java.util.Random;

import weka.core.Instance;
import weka.core.Instances;

public class RUSSampling {
	public Instances doRUS(Instances inputDataSet) {
		int minIndex = 0;
		int maxIndex = 0;
		int min = Integer.MAX_VALUE;
		int max = Integer.MIN_VALUE;

		// Find minority and majority class
		int[] classCounts = inputDataSet.attributeStats(inputDataSet.classIndex()).nominalCounts;
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

		// Create a temporary majority list
		ArrayList<Integer> majority = new ArrayList<Integer>();

		// Add majority instantes to the majority list
		for (int i = 0; i < inputDataSet.size(); i++) {
			if ((int) inputDataSet.get(i).classValue() == maxIndex) {
				majority.add(i);
			}
		}

		// Calculate the amount of majority instances to delete
		int majorityInstancesToDelete = classCounts[maxIndex] - classCounts[minIndex];

		// Delete majority instances randomly
		Random r = new Random();
		for (int i = 0; i < majorityInstancesToDelete; i++) {
			majority.remove(r.nextInt(majority.size()));
		}

		// All initial instances are pushed only if they are contained in the
		// majority temp list or if they are minority instances
		Instances result = new Instances(inputDataSet, 0);
		for (int i = 0; i < inputDataSet.size(); i++) {
			if (((int) inputDataSet.get(i).classValue() == minIndex)
					|| ((int) inputDataSet.get(i).classValue() == maxIndex && majority.contains(i))) {
				result.add((Instance) inputDataSet.get(i).copy());
			}
		}
		
		return result;
	}
}
