output "lambda_function_arn" {
  value = aws_lambda_function.backend.arn
}

output "api_gateway_url" {
  value = aws_apigatewayv2_api.http_api.api_endpoint
}

output "s3_bucket_website_url" {
  value = aws_s3_bucket.frontend_bucket.website_endpoint
}

output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.frontend_distribution.domain_name
}
