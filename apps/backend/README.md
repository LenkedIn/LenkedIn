# .env docs
all param will be available on lambda functions by calling `process.env.{param_name}`

| Params          | description |
| --------------- |:-------------:|
| DYNAMODB_TABLE  | table name of dynamoDB     |
| ALCHEMY_API_KEY | api key of alchemy     |
| REGION          | AWS region of function been deployed to     |
| AWS_PROFILE     | AWS profile name(default is `default`)     |


# configure AWS credentials

```bash
serverless config credentials \
  --provider aws \
  --key AKIAIOSFODNN7EXAMPLE \
  --secret wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```


# Usage

- invoke function locally

`serverless invoke local --function {function_name}`

- deploy to AWS(cloudformationm dynamoDB and functions)

`serverless`