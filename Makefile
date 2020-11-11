


logs:
	awslogs get "/aws/lambda/lguerra-ready-test-dev-get-index" ALL --watch --aws-region us-east-1 --stage dev --profile lguerra

logs-restaurants:
	awslogs get "/aws/lambda/lguerra-ready-test-dev-get-restaurants" ALL --watch --aws-region us-east-1 --stage dev --profile lguerra

logs-search:
	awslogs get "/aws/lambda/lguerra-ready-test-dev-search-restaurants" ALL --watch --aws-region us-east-1 --stage dev --profile lguerra
