#! /bin/bash

filenames=(\
    "editor"\
    "elements"\
    "metrics"\
    "survey"\
    "reset"\
)

rm -Rf css
mkdir -p css

for n in "${filenames[@]}"
do
	lessc "less/$n.less" > "css/$n.css"
done
