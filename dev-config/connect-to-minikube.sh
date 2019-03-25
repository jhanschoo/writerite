ssh-keygen -f "/home/jhanschoo/.ssh/known_hosts" -R "$(minikube ip)"
ssh -o "StrictHostKeyChecking no" -i "~/.minikube/machines/minikube/id_rsa" "docker@$(minikube ip)" -L "4000:127.0.0.1:443"