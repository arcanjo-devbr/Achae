#!/bin/sh

protected_branch='^(main|dev)$'

while read local_ref local_sha remote_ref remote_sha
do
  branch_name=$(echo "$remote_ref" | sed 's|refs/heads/||')

  if echo "$branch_name" | grep -Eq "$protected_branch"; then
    echo "Erro: push direto para '$branch_name' não é permitido."
    echo "Crie uma branch feature/* e abra um Pull Request."
    exit 1
  fi
done