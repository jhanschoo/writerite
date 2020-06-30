# https://kubernetes.github.io/ingress-nginx/
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install -n writerite-10694983-production ingress-nginx ingress-nginx/ingress-nginx
kubectl apply -f writerite.ingress.yaml