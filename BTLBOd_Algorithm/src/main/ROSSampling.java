package main;

import java.util.ArrayList;
import java.util.Random;

import weka.core.Instance;
import weka.core.Instances;

public class ROSSampling {
	public Instances doROS(Instances inputDataSet) {
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
		ArrayList<Integer> minority = new ArrayList<Integer>();

		// Add majority instantes to the majority list
		for (int i = 0; i < inputDataSet.size(); i++) {
			if ((int) inputDataSet.get(i).classValue() == minIndex) {
				minority.add(i);
			}
		}

		// Calculate the amount of majority instances to delete
		int minorityInstancesToAdd = classCounts[maxIndex] - classCounts[minIndex];

		// Delete majority instances randomly
		Random r = new Random();
		ArrayList<Integer> minorityAdded = new ArrayList<Integer>();
		
		for (int i = 0; i < minorityInstancesToAdd; i++) {
			minorityAdded.add(minority.get(r.nextInt(minority.size())));
		}

		// All initial instances are pushed only if they are contained in the
		// majority temp list or if they are minority instances
		Instances result = new Instances(inputDataSet);
		for (int i = 0; i < minorityAdded.size(); i++) {
			result.add((Instance) inputDataSet.get(minorityAdded.get(i)).copy()); 
		}
		
		return result;
	}
}
