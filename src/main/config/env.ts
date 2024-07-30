export const getEnv = () => ({
  database_url: String(process.env.DATABASE_URL),
  awsAccessKey: String(process.env.AWS_ACCESS_KEY),
  bucketName: String(process.env.AWS_S3_BUCKET),
  defaultRegion: String(process.env.AWS_DEFAULT_REGION),
  defaultFilesACL: String(process.env.AWS_DEFAULT_FILES_ACL),
  awsSecretAccessKey: String(process.env.AWS_SECRET_ACCESS_KEY),
});
