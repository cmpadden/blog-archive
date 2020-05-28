---
title: "Building a Data Pipelines using Apache Airflow"
date: 2020-01-24
draft: true
tags: ["apache", "airflow", "spark", "postgres", "data-processing"]
categories: ["data", "pipelines"]
---

# Apache Airflow

This blog post will outline how to create a batch data processing pipeline
using Apache Airflow, that can read and write to a database, launch Apache
Spark jobs, and leverage Google Cloud infrastructure.

## The Workflow

The workflow defined will be a daily batch job that reads in a list of files to
be processed from an external source, in this case a Postgres database table,
and will process them using Apache Spark.

The steps of the workflow are as follows:

1. Retrieve a list of files to be processed from the database
2. Create a Dataproc cluster
3. Submit an Apache Spark job for processing
4. Update file statuses in the database table
5. Bring down the Dataproc cluster

![Workflow Diagram (DAG)]({{< resource url="airflow/airflow_workflow_dag.png">}})

## Operators

In Airflow, a workflow is defined as a directed acyclic graph (DAG), and is
composed of operators. Where an operator describes an individual task of the
workflow (e.g. submitting a Spark job). One of the main benefits of using a
tool like Airflow is that many operators have already been defined, and in the
case where they are not, it is very simple to extend base operators to
accomplish your needs.

### Postgres File Retrieval


```python
class RetrieveFilesOperator(BaseOperator):
    """ Retrieve files to be processed and write them to a local file
    """

    template_fields = ['file_upload_date', 'output_file']

    @apply_defaults
    def __init__(
            self,
            postgres_conn_id,
            table,
            file_upload_date,
            output_file,
            *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.postgres_conn_id = postgres_conn_id
        self.table = table
        self.file_upload_date = file_upload_date
        self.output_file = output_file

    def execute(self, context):
        hook = PostgresHook(postgres_conn_id=self.postgres_conn_id)
        cursor = hook.get_conn().cursor()

        query_components = [
            "COPY ("
            "SELECT upload_location FROM \"{}\"".format(self.table),
            "WHERE file_upload_date = '{}'".format(self.dataset_date),
            "AND processing_date IS NULL",
            ") TO STDOUT",
        ]
        sql = " ".join(query_components)

        # create output directory if it doesn't already exist
        output_dir = self.output_file.replace("/files.csv", "")
        os.makedirs(output_dir, exist_ok=True)

        # write query results to a file
        with open(self.output_file, 'w') as f:
            cursor.copy_expert(sql, f)
```

## Scheduling

## Secrets


## Appendix

### Terminology

Term | Definition
--- | ---
Workflow | ...
Directed Acyclic Graph (DAG) | ...
Operator | ...
Macros | ...

### References

Apache Airflow Concepts
https://airflow.apache.org/docs/stable/concepts.html
