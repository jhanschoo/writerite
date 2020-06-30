gcloud iam service-accounts create dns01-solver --display-name "dns01-solver"
export PROJECT_ID=writerite
gcloud iam roles create dns01_solver --project=$PROJECT_ID \
  --permissions="dns.changes.create,dns.changes.get,dns.changes.list,dns.managedZones.list,dns.resourceRecordSets.create,dns.resourceRecordSets.delete,dns.resourceRecordSets.list,dns.resourceRecordSets.update" \
  --stage=GA
gcloud projects add-iam-policy-binding $PROJECT_ID \
   --member serviceAccount:dns01-solver@$PROJECT_ID.iam.gserviceaccount.com \
   --role projects/writerite/roles/dns01_solver
gcloud iam service-accounts keys create key.json \
   --iam-account dns01-solver@$PROJECT_ID.iam.gserviceaccount.com
rm key.json