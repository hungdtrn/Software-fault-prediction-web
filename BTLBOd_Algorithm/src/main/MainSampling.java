package main;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Enumeration;
import java.util.Scanner;

import javax.print.attribute.standard.OrientationRequested;

import com.sun.corba.se.internal.iiop.ORB;
import com.sun.org.apache.xpath.internal.operations.Or;

import weka.classifiers.Classifier;
import weka.classifiers.Evaluation;
import weka.classifiers.bayes.BayesNet;
import weka.classifiers.evaluation.ThresholdCurve;
import weka.classifiers.functions.MultilayerPerceptron;
import weka.classifiers.functions.SMO;
import weka.classifiers.lazy.IBk;
import weka.classifiers.trees.J48;
import weka.classifiers.trees.RandomForest;
import weka.core.Attribute;
import weka.core.Instances;
import weka.core.converters.ConverterUtils.DataSource;

class SaveData {
	double [] SVM = new double [30];
	double [] RF = new double [30];
	double [] MLP = new double [30];
	double [] Bayes = new double [30];
	double [] KNN = new double [30];
	
	public SaveData() {}
}

public class MainSampling {
	
	public static SaveData Original;
	public static SaveData SaveRUS;
	public static SaveData SaveROS;
	public static SaveData SaveSMOTE;
	public static SaveData SaveSocialPSO;
	public static SaveData SaveMePSO;
	public static SaveData SaveBTLBO;
	public static SaveData SaveGBTLBO;
	public static SaveData SaveGBTLBOCros;
	
	static {
		Original = new SaveData();
		SaveRUS = new SaveData();
		SaveROS = new SaveData();
		SaveSMOTE = new SaveData();
		SaveSocialPSO = new SaveData();
		SaveMePSO = new SaveData();
		SaveBTLBO = new SaveData();
		SaveGBTLBO = new SaveData();
		SaveGBTLBOCros = new SaveData();
	}
	
	public static void prediction(int iter, int algo, PrintWriter writer, Instances originalTrainingInstances, Instances originalTestingInstances) throws Exception {
		Evaluation eval = new Evaluation(originalTrainingInstances);
		    
	    SMO svm = new SMO();
	    svm.buildClassifier(originalTrainingInstances);
	    
	    eval.evaluateModel(svm, originalTestingInstances);
	    
	    if (algo == 0) {
	    	Original.SVM[0] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 1) {
	    	SaveRUS.SVM[iter] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 2) {
	    	SaveROS.SVM[iter] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 3) {
	    	SaveSMOTE.SVM[iter] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 4) {
	    	SaveSocialPSO.SVM[iter] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 5) {
	    	SaveMePSO.SVM[iter] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 6) {
	    	SaveBTLBO.SVM[iter] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 7) {
	    	SaveGBTLBO.SVM[iter] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 8) {
	    	SaveGBTLBOCros.SVM[iter] = eval.weightedAreaUnderROC();
	    }
	    
	    writer.println(eval.toSummaryString("\nResult SVM\n", false));
	    writer.println(eval.toClassDetailsString());
	    writer.flush();
	   
	    RandomForest rf = new RandomForest();
		rf.setNumIterations(100);
		rf.buildClassifier(originalTrainingInstances);
		
		eval = new Evaluation(originalTrainingInstances);
		eval.evaluateModel(rf, originalTestingInstances);
		
		if (algo == 0) {
	    	Original.RF[0] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 1) {
	    	SaveRUS.RF[iter] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 2) {
	    	SaveROS.RF[iter] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 3) {
	    	SaveSMOTE.RF[iter] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 4) {
	    	SaveSocialPSO.RF[iter] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 5) {
	    	SaveMePSO.RF[iter] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 6) {
	    	SaveBTLBO.RF[iter] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 7) {
	    	SaveGBTLBO.RF[iter] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 8) {
	    	SaveGBTLBOCros.RF[iter] = eval.weightedAreaUnderROC();
	    }
		
		writer.println(eval.toSummaryString("\n\nResult RF\n", false));
		writer.println(eval.toClassDetailsString());
		writer.flush();
		
		//Instance of NN
		MultilayerPerceptron mlp = new MultilayerPerceptron();
		//Setting Parameters
		//mlp.setLearningRate(0.05);
		//mlp.setMomentum(0.2);
		//mlp.setTrainingTime(1000);
		mlp.setHiddenLayers("a");
		mlp.buildClassifier(originalTrainingInstances);
		
		eval = new Evaluation(originalTrainingInstances);
		eval.evaluateModel(mlp, originalTestingInstances);
		
		if (algo == 0) {
	    	Original.MLP[0] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 1) {
	    	SaveRUS.MLP[iter] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 2) {
	    	SaveROS.MLP[iter] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 3) {
	    	SaveSMOTE.MLP[iter] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 4) {
	    	SaveSocialPSO.MLP[iter] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 5) {
	    	SaveMePSO.MLP[iter] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 6) {
	    	SaveBTLBO.MLP[iter] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 7) {
	    	SaveGBTLBO.MLP[iter] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 8) {
	    	SaveGBTLBOCros.MLP[iter] = eval.weightedAreaUnderROC();
	    }
		
		writer.println(eval.toSummaryString("\n\nResult MLP\n", false));
		writer.println(eval.toClassDetailsString());
		writer.flush();
		
		BayesNet bayes = new BayesNet();
		bayes.buildClassifier(originalTrainingInstances);
		eval = new Evaluation(originalTrainingInstances);
		eval.evaluateModel(bayes, originalTestingInstances);
		
		if (algo == 0) {
	    	Original.Bayes[0] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 1) {
	    	SaveRUS.Bayes[iter] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 2) {
	    	SaveROS.Bayes[iter] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 3) {
	    	SaveSMOTE.Bayes[iter] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 4) {
	    	SaveSocialPSO.Bayes[iter] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 5) {
	    	SaveMePSO.Bayes[iter] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 6) {
	    	SaveBTLBO.Bayes[iter] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 7) {
	    	SaveGBTLBO.Bayes[iter] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 8) {
	    	SaveGBTLBOCros.Bayes[iter] = eval.weightedAreaUnderROC();
	    }
		
		writer.println(eval.toSummaryString("\n\nResult BayesNetwork\n", false));
		writer.println(eval.toClassDetailsString());
		writer.flush();
		
		IBk knn = new IBk();
		((IBk)knn).setKNN(3);
		knn.buildClassifier(originalTrainingInstances);
		
		eval = new Evaluation(originalTrainingInstances);
		eval.evaluateModel(knn, originalTestingInstances);
		
		if (algo == 0) {
	    	Original.KNN[0] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 1) {
	    	SaveRUS.KNN[iter] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 2) {
	    	SaveROS.KNN[iter] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 3) {
	    	SaveSMOTE.KNN[iter] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 4) {
	    	SaveSocialPSO.KNN[iter] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 5) {
	    	SaveMePSO.KNN[iter] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 6) {
	    	SaveBTLBO.KNN[iter] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 7) {
	    	SaveGBTLBO.KNN[iter] = eval.weightedAreaUnderROC();
	    }
	    else if (algo == 8) {
	    	SaveGBTLBOCros.KNN[iter] = eval.weightedAreaUnderROC();
	    }
		
		writer.println(eval.toSummaryString("\n\nResult KNN\n", false));
		writer.println(eval.toClassDetailsString());
		writer.flush();
	}
	
	public static void saveCSVFile(String inputFile) throws IOException {
		File file = new File("Result_" + inputFile + ".csv.txt");
	    
		if (!file.exists()) {
			file.createNewFile();
	    }
	    
		FileWriter fw = new FileWriter(file, true);
	    BufferedWriter bw = new BufferedWriter(fw);
	    PrintWriter writer = new PrintWriter(bw);
	    
	    writer.println("Iter, Original, , , , , RUS, , , , , ROS, , , , , SMOTE, , , , , Social PSO, , , , , MePSO, , , , , BTLBO, , , , , GBTLBO, , , , , GBTLBO Cros, , , , ,");
	    writer.println(" , SVM, RF, MLP, Bayes, KNN, SVM, RF, MLP, Bayes, KNN, SVM, RF, MLP, Bayes, KNN, SVM, RF, MLP, Bayes, KNN, SVM, RF, MLP, Bayes, KNN, SVM, RF, MLP, Bayes, KNN, SVM, RF, MLP, Bayes, KNN, SVM, RF, MLP, Bayes, KNN, SVM, RF, MLP, Bayes, KNN");
	    for (int i = 0; i < 30; i++) {
	    	writer.println((i + 1) + ", " + Original.SVM[0] + ", " + Original.RF[0] + ", " + Original.MLP[0] + ", " + Original.Bayes[0] + ", " + Original.KNN[0] + ", " + SaveRUS.SVM[i] + ", " + SaveRUS.RF[i] + ", " + SaveRUS.MLP[i] + ", " + SaveRUS.Bayes[i] + ", " + SaveRUS.KNN[i] + ", " + SaveROS.SVM[i] + ", " + SaveROS.RF[i] + ", " + SaveROS.MLP[i] + ", " + SaveROS.Bayes[i] + ", " + SaveROS.KNN[i] + ", " + SaveSMOTE.SVM[i] + ", " + SaveSMOTE.RF[i] + ", " + SaveSMOTE.MLP[i] + ", " + SaveSMOTE.Bayes[i] + ", " + SaveSMOTE.KNN[i] + ", " + SaveSocialPSO.SVM[i] + ", " + SaveSocialPSO.RF[i] + ", " + SaveSocialPSO.MLP[i] + ", " + SaveSocialPSO.Bayes[i] + ", " + SaveSocialPSO.KNN[i] + ", " + SaveMePSO.SVM[i] + ", " + SaveMePSO.RF[i] + ", " + SaveMePSO.MLP[i] + ", " + SaveMePSO.Bayes[i] + ", " + SaveMePSO.KNN[i] + ", " + SaveBTLBO.SVM[i] + ", " + SaveBTLBO.RF[i] + ", " + SaveBTLBO.MLP[i] + ", " + SaveBTLBO.Bayes[i] + ", " + SaveBTLBO.KNN[i] + ", " + SaveGBTLBO.SVM[i] + ", " + SaveGBTLBO.RF[i] + ", " + SaveGBTLBO.MLP[i] + ", " + SaveGBTLBO.Bayes[i] + ", " + SaveGBTLBO.KNN[i] + ", " + SaveGBTLBOCros.SVM[i] + ", " + SaveGBTLBOCros.RF[i] + ", " + SaveGBTLBOCros.MLP[i] + ", " + SaveGBTLBOCros.Bayes[i] + ", " + SaveGBTLBOCros.KNN[i]);
	    	writer.flush();
	    }
	    
	    writer.flush();
	    writer.close();
	}
	
	public static void main(String[] args) throws Exception {
		
		String testFile;// = "PC5_Testing.arff";
		String trainFile;// = "PC5_Training.arff";
		
		Scanner scanner = new Scanner(System.in);
		System.out.print("Enter file Name: "); 
		String inputFile = scanner.next();
		trainFile = inputFile + "_Training.arff";
		testFile = inputFile + "_Testing.arff";
		
		System.out.println("Training: " + trainFile + "  Testing: " + testFile);
		
		
		DataSource sourceTrain = new DataSource("Dataset/" + trainFile);
		Instances originalTrainingInstances = sourceTrain.getDataSet();
		originalTrainingInstances.setClassIndex(originalTrainingInstances.numAttributes() - 1);
		
		DataSource sourceTest = new DataSource("Dataset/" + testFile);
		Instances originalTestingInstances = sourceTest.getDataSet();
		originalTestingInstances.setClassIndex(originalTestingInstances.numAttributes() - 1);
		
		File file = new File("Result_" + inputFile + ".txt");
	    
		if (!file.exists()) {
			file.createNewFile();
	    }
	    
		FileWriter fw = new FileWriter(file, true);
	    BufferedWriter bw = new BufferedWriter(fw);
	    PrintWriter writer = new PrintWriter(bw);
	    
	   // System.out.println("Original Size: " + originalTrainingInstances.size());
	    
	   writer.println("=========Original Dataset============");
	   prediction(0, 0, writer, originalTrainingInstances, originalTestingInstances);
	   writer.println("======================================\n");
	
	   writer.println("=========Random Under Sampling========");
	   for (int i = 0; i < 30; i++) {
		   writer.println("========ITER: " + (i + 1) + "=======");
		   Instances rusIns = new RUSSampling().doRUS(originalTrainingInstances);
		   prediction(i, 1, writer, rusIns, originalTestingInstances);
	   }
	   writer.println("======================================\n");
	   
	   writer.println("=========Random Over Sampling========");
	   for (int i = 0; i < 30; i++) {
		   writer.println("========ITER: " + (i + 1) + "=======");
		   Instances rosIns = new ROSSampling().doROS(originalTrainingInstances);
		   prediction(i, 2, writer, rosIns, originalTestingInstances);
	   }
	   writer.println("======================================\n");
	   
	   writer.println("=========SMOTE Sampling========");
	   for (int i = 0; i < 30; i++) {
		   writer.println("========ITER: " + (i + 1) + "=======");
		   SMOTE smote = new SMOTE();
		   smote.setMinoritySamplesToGenerate(-1);
		   Instances smoteIns = smote.SMOTESampling(originalTrainingInstances);
		   prediction(i, 3, writer, smoteIns, originalTestingInstances);
	   }
	   writer.println("======================================\n");
	   
	   writer.println("=========Social Learning PSO based Sampling========");
	   for (int i = 0; i < 30; i++) {
		   writer.println("========ITER: " + (i + 1) + "=======");
		   EvolutionSampling eSampling = new EvolutionSampling(5, trainFile);
		   Instances optimizedBalancedDataset = eSampling.evolvingSampling(0);
		   prediction(i, 4, writer, optimizedBalancedDataset, originalTestingInstances);
	   }
	   writer.println("======================================\n");
	   
	   writer.println("=========Mentor Learning PSO based Sampling========");
	   for (int i = 0; i < 30; i++) {
		   writer.println("========ITER: " + (i + 1) + "=======");
		   EvolutionSampling eSampling = new EvolutionSampling(5, trainFile);
		   Instances optimizedBalancedDataset = eSampling.evolvingSampling(1);
		   prediction(i, 5, writer, optimizedBalancedDataset, originalTestingInstances);
	   }
	   writer.println("======================================\n");
		
	   writer.println("=========BTLBO based Sampling========");
	   for (int i = 0; i < 30; i++) {
		   writer.println("========ITER: " + (i + 1) + "=======");
		   EvolutionSampling eSampling = new EvolutionSampling(5, trainFile);
		   Instances optimizedBalancedDataset = eSampling.evolvingSampling(2);
		   prediction(i, 6, writer, optimizedBalancedDataset, originalTestingInstances);
	   }
	   writer.println("======================================\n");
	   
	   writer.println("=========GBTLBO based Sampling========");
	   for (int i = 0; i < 30; i++) {
		   writer.println("========ITER: " + (i + 1) + "=======");
		   EvolutionSampling eSampling = new EvolutionSampling(5, trainFile);
		   Instances optimizedBalancedDataset = eSampling.evolvingSampling(3);
		   prediction(i, 7, writer, optimizedBalancedDataset, originalTestingInstances);
	   }
	   writer.println("======================================\n");
	   
	   writer.println("=========GBTLBO Crossover based Sampling========");
	   for (int i = 0; i < 30; i++) {
		   writer.println("========ITER: " + (i + 1) + "=======");
		   EvolutionSampling eSampling = new EvolutionSampling(5, trainFile);
		   Instances optimizedBalancedDataset = eSampling.evolvingSampling(4);
		   prediction(i, 8, writer, optimizedBalancedDataset, originalTestingInstances);
	   }
	   writer.println("======================================\n");
	   
	    writer.flush();
	    writer.close();
	    
	    saveCSVFile(inputFile);
	    
	    System.out.println("====FINISHED=====");
		
//		DataSource source = new DataSource("Dataset/PC5_Training.arff");
//		Instances data = source.getDataSet();
//		data.setClassIndex(data.numAttributes() - 1);
//		System.out.println("Num Attributes: " + data.numAttributes());
//		// Add new attribute for ID
//		data.insertAttributeAt(new Attribute("ID"), 0);
//		data.setClassIndex(data.numAttributes() - 1);
//		System.out.println("Num Attributes: " + data.numAttributes());
//		for (int i = 0; i < data.numInstances(); i++) {
//			data.instance(i).setValue(0, i);
//		}
//		System.out.println(data.instance(1).toString());
//		// Remove attribute
//		//data.deleteAttributeAt(0);
//		System.out.println(data.instance(1).toString());
//		 
//		int minIndex = 0;
//		int maxIndex = 0;
//		int min = Integer.MAX_VALUE;
//		int max = Integer.MIN_VALUE;
//
//		// Find minority and majority class
//		int[] classCounts = data.attributeStats(data.classIndex()).nominalCounts;
//		System.out.println(classCounts.length);
//		for (int i = 0; i < classCounts.length; i++) {
//			if (classCounts[i] != 0 && classCounts[i] < min) {
//				min = classCounts[i];
//				minIndex = i;
//			}
//			if (classCounts[i] != 0 && classCounts[i] > max) {
//				max = classCounts[i];
//				maxIndex = i;
//			}
//		}
//		System.out.println("Min: " + minIndex + "  Max: " + maxIndex);
//		
//		// Create a temporary majority list
//		ArrayList<Integer> majority = new ArrayList<Integer>();
//
//		// Add majority instantes to the majority list
//		for (int i = 0; i < data.size(); i++) {
//			if ((int) data.instance(i).classValue() == maxIndex) {
//				majority.add(i);
//			}
//		}
//		System.out.println(majority.toString());
//		//System.out.println(data.instance(3).value(8));
//		System.out.println(data.size());
//		Instances training = data.trainCV(10, 1);
//		System.out.println(training.size());
//		System.out.println(training.instance(training.size() - 1).value(0));
//		System.out.println(training.instance(0).value(0));
//		training.deleteAttributeAt(0);
//		training.setClassIndex(training.numAttributes() - 1);
//		Instances testing = data.testCV(10, 1);
//		System.out.println(testing.instance(testing.size() - 1).value(0));
//		System.out.println(testing.instance(0).value(0));
//		testing.deleteAttributeAt(0);
//		testing.setClassIndex(testing.numAttributes() - 1);
//		
//		Classifier j48tree = new J48();
//		j48tree.buildClassifier(training);
////		int num = 0;
////		for(int i = 0; i < testing.numInstances(); i++) {
////            
////            double index = j48tree.classifyInstance(testing.instance(i));
////            String className = training.attribute(training.numAttributes() - 1).value((int)index);
////            int realName = (int) testing.instance(i).classValue();
////            if (index != realName)
////            	++num;
////            System.out.println(className);
////		}
////		
////		System.out.println("Num Errors: " + num);
//		
//		Evaluation eval = new Evaluation(training);
//		eval.evaluateModel(j48tree, testing);
//		System.out.println(eval.toSummaryString("\nResults\n======\n", false));
//		System.out.println(eval.toClassDetailsString());
//		System.out.println(eval.areaUnderROC(0));
//		
//		ThresholdCurve tc = new ThresholdCurve();
//		Instances result = tc.getCurve(eval.predictions(), 1);
//		System.out.println("AUC = " + tc.getROCArea(result));
	}

}
