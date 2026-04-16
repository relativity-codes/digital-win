variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "lambda_function_name" {
  description = "Name for the Lambda function"
  type        = string
  default     = "digital-win-backend"
}

variable "s3_bucket_name" {
  description = "Name for the S3 bucket to host frontend"
  type        = string
  default     = "digital-win-frontend-bucket"
}

variable "cloudfront_comment" {
  description = "Comment for CloudFront distribution"
  type        = string
  default     = "Digital Win Frontend Distribution"
}

# Backend environment variables (set via TF_VAR_*)
variable "openai_api_key" {
  description = "OpenAI API Key"
  type        = string
  sensitive   = true
}
variable "openai_base_url" {
  description = "OpenAI Base URL"
  type        = string
  default     = "https://openrouter.ai/api/v1"
}
variable "cors_origins" {
  description = "CORS origins (comma separated)"
  type        = string
  default     = "http://localhost:3000"
}
variable "bedrock_model_id" {
  description = "Bedrock Model ID"
  type        = string
  default     = "global.amazon.nova-2-lite-v1:0"
}
variable "use_s3" {
  description = "Use S3 for storage"
  type        = string
  default     = "false"
}
variable "s3_bucket" {
  description = "S3 bucket name"
  type        = string
  default     = ""
}
variable "memory_dir" {
  description = "Memory directory path"
  type        = string
  default     = "./memory"
}
variable "redis_host" {
  description = "Redis host"
  type        = string
  default     = "localhost"
}
variable "redis_port" {
  description = "Redis port"
  type        = string
  default     = "6379"
}
variable "redis_password" {
  description = "Redis password"
  type        = string
  default     = ""
  sensitive   = true
}
variable "redis_db" {
  description = "Redis DB index"
  type        = string
  default     = "0"
}

variable "redis_user" {
  description = "Redis username (if needed)"
  type        = string
  default     = ""
  sensitive   = true
}
