# https://kubernetes.github.io/ingress-nginx/
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install -n writerite-10694983-production ingress-nginx ingress-nginx/ingress-nginx
#cat << EOF > values.yaml
#hostPort:
#  enabled: true
#EOF
#helm install -f values.yaml -n writerite-10694983-production ingress-nginx ingress-nginx/ingress-nginx
sleep 30
kubectl apply -f writerite.ingress.yaml