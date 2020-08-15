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

public class Q4b {
    public static class tripMapper extends Mapper<Object,Text,IntWritable,DoubleWritable>{
        public void map(Object key,Text value,Context context) throws IOException, InterruptedException{
            String[] params = value.toString().split("\t");
            int passCount = Integer.parseInt(params[2]);
            double totalfare = Double.parseDouble(params[3]);
            context.write(new IntWritable(passCount),new DoubleWritable(totalfare));
        }
    }

    public static class tripReducer extends Reducer<IntWritable,DoubleWritable,IntWritable,Text>{
        public void reduce(IntWritable key,Iterable<DoubleWritable> values,Context context) throws IOException, InterruptedException{
            double total=0.0;
            int count = 0;
            for(DoubleWritable fare:values){
                total += fare.get();
                count += 1;                
            }
            double avg = total/count;
            String avg_str = String.format("%.2f", avg);
            context.write(key,new Text(avg_str));
        }
    }

  public static void main(String[] args) throws Exception {
    /* TODO: Update variable below with your gtid */
    final String gtid = "pkaundinya3";

    Configuration conf = new Configuration();
    Job job = Job.getInstance(conf, "Q4b");

    job.setJarByClass(Q4b.class);
    job.setMapperClass(tripMapper.class);
    job.setReducerClass(tripReducer.class);
    job.setMapOutputKeyClass(IntWritable.class);
    job.setMapOutputValueClass(DoubleWritable.class);
    job.setOutputKeyClass(Text.class);
    job.setOutputValueClass(Text.class);

    FileInputFormat.addInputPath(job, new Path(args[0]));
    FileOutputFormat.setOutputPath(job, new Path(args[1]));
    System.exit(job.waitForCompletion(true) ? 0 : 1);
  }
}
