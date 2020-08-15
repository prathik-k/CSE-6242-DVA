package edu.gatech.cse6242;

import java.util.StringTokenizer;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.io.*;
import java.io.*;
import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.util.*;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

public class Q1 {
/* TODO: Update variable below with your gtid */
  final String gtid = "pkaundinya3";

  public static class tripMapper extends Mapper<Object,Text,IntWritable,Text>{
  	public void map(Object key,Text value,Context context) throws IOException,InterruptedException{
  		String[] params = value.toString().split(",");
  		int puid = Integer.parseInt(params[0]);
  		int doid = Integer.parseInt(params[1]);
  		float dist = Float.parseFloat(params[2]); 
  		float fare = Float.parseFloat(params[3]);
  		if(dist>0.0 && fare>0.0){
  			context.write(new IntWritable(puid),new Text(Integer.toString(doid)+","+fare));
  		}
  	}
  }

  public static class tripReducer extends Reducer<IntWritable,Text,Text,Text>{
  	public void reduce(IntWritable key,Iterable <Text> values, Context context) throws IOException,InterruptedException{
  		float totalfare = 0;
  		int trips = 0;
  		for(Text tripdata : values){
  			String[] tripdetails = tripdata.toString().split(",");
  			float fare = Float.parseFloat(tripdetails[1]);
  			trips += 1;
  			totalfare += fare;
  		}
  		String puid = Integer.toString(key.get());
  		context.write(new Text(puid),new Text(Integer.toString(trips)+","+String.format("%.02f",totalfare)));
  	}
  }



  public static void main(String[] args) throws Exception{
    Configuration conf = new Configuration();
    Job job = Job.getInstance(conf, "Q1");

    /* TODO: Needs to be implemented */
    job.setJarByClass(Q1.class);
    job.setMapperClass(tripMapper.class);
    job.setReducerClass(tripReducer.class);
    job.setOutputKeyClass(IntWritable.class);
    job.setOutputValueClass(Text.class);

    FileInputFormat.addInputPath(job, new Path(args[0]));
    FileOutputFormat.setOutputPath(job, new Path(args[1]));
    System.exit(job.waitForCompletion(true) ? 0 : 1);
  }
}
