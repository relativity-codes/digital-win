# Digital Win Terraform Deployment

## Prerequisites

- Terraform >= 1.3.0
- AWS CLI configured with appropriate credentials
- Backend Python code packaged as `lambda.zip` in the backend directory
- Frontend static files built and ready for upload

## Usage

1. Initialize Terraform:

   ```sh
   cd terraform
   terraform init
   ```

2. Review and apply the plan:

   ```sh
   terraform plan
   terraform apply
   ```

3. Deploy Lambda code:
   - Ensure your backend is packaged as `lambda.zip` (use `zip -r lambda.zip .` inside backend, excluding unnecessary files)
   - Update and re-apply Terraform if code changes

4. Upload frontend to S3:

   ```sh
   aws s3 sync ../frontend/out/ s3://digital-win-frontend-bucket --delete
   ```

   (Replace with your actual S3 bucket name if changed)

5. Invalidate CloudFront cache after upload:

   ```sh
   aws cloudfront create-invalidation --distribution-id <CLOUDFRONT_DIST_ID> --paths "/*"
   ```

## Outputs

- Lambda function ARN
- API Gateway URL
- S3 website URL
- CloudFront domain name

Check `terraform/outputs.tf` for details.
