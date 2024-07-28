export const getEnv = () => ({
  database_url: String(process.env.DATABASE_URL),
  bucketName: String(process.env.AWS_S3_BUCKET),
  defaultRegion: String(process.env.AWS_DEFAULT_REGION),
  defaultFilesACL: String(process.env.AWS_DEFAULT_FILES_ACL),
});
