package edu.gatech.cse6242;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.io.*;
import java.io.*;
import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.util.*;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

public class Q4a {
	public static class tripMapper1 extends Mapper<Object,Text,IntWritable,IntWritable>{
  		public void map(Object key,Text value,Context context) throws IOException,InterruptedException {
  			String[] params = value.toString().split("\t");
  			int source = Integer.parseInt(params[0]);
  			int target = Integer.parseInt(params[1]);
  			context.write(new IntWritable(source),new IntWritable(1));
  			context.write(new IntWritable(target),new IntWritable(-1));
  		}
  	}

  	public static class tripReducer1 extends Reducer<IntWritable,IntWritable,IntWritable,IntWritable>{
  		public void reduce(IntWritable key,Iterable<IntWritable> values,Context context) throws IOException,InterruptedException{
  			int net_degree = 0;
  			for(IntWritable degree:values){
  				net_degree += degree.get();
  			}
  			context.write(key,new IntWritable(net_degree));
  		}
  		}

  	public static class tripMapper2 extends Mapper<Object, Text, IntWritable, IntWritable>{
  		public void map(Object key,Text value,Context context) throws IOException,InterruptedException{
        String[] params = value.toString().split("\t");
        context.write(new IntWritable(Integer.parseInt(params[1])),new IntWritable(1));   
        }
      }
          

    public static class tripReducer2 extends Reducer<IntWritable,IntWritable,IntWritable,IntWritable>{
      public void reduce(IntWritable key,Iterable<IntWritable> values,Context context) throws IOException,InterruptedException{
        int net_degree = 0;
        for(IntWritable degree:values){
          net_degree = net_degree + degree.get();
        }
        context.write(key,new IntWritable(net_degree));
      }
    } 


  public static void main(String[] args) throws Exception {

    /* TODO: Update variable below with your gtid */
    final String gtid = "pkaundinya3";

    //Set classes
    Configuration conf = new Configuration();
    Job job1 = Job.getInstance(conf, "job1");
    job1.setJarByClass(Q4a.class);
    job1.setMapperClass(tripMapper1.class);
    job1.setCombinerClass(tripReducer1.class);
    job1.setReducerClass(tripReducer1.class);
    job1.setOutputKeyClass(IntWritable.class);
    job1.setOutputValueClass(IntWritable.class);

    FileInputFormat.addInputPath(job1, new Path(args[0]));
    FileOutputFormat.setOutputPath(job1, new Path("mapReduce1"));

    //Wait for completion of first MapReduce procedure

    job1.waitForCompletion(true);

    Job job2 = Job.getInstance(conf, "job2");
    job2.setJarByClass(Q4a.class);
    job2.setMapperClass(tripMapper2.class);
    job2.setCombinerClass(tripReducer2.class);
    job2.setReducerClass(tripReducer2.class);
    job2.setOutputKeyClass(IntWritable.class);
    job2.setOutputValueClass(IntWritable.class);

    FileInputFormat.addInputPath(job2, new Path("mapReduce1"));
    FileOutputFormat.setOutputPath(job2, new Path(args[1]));

    System.exit(job2.waitForCompletion(true) ? 0 : 1);    
  }

}