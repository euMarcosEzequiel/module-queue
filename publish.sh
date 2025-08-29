git checkout -b build

tsc || { echo "Erro na compilação"; exit 1; }

cp package.json dist/

shopt -s extglob

rm -rf !(dist)

cp dist/* .

rm -rf dist

git add .

git commit -m "deploy build"

git push origin build --force

git checkout main

git branch -D build

git reset --hard