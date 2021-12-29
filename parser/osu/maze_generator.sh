#!/bin/bash
DIR=$1
cd ../../mazegenerator/src
make
./mazegen -w 30 -h 30
cd ../../parser/osu
python3 ../svg_parser.py
cp data_lines.json "${DIR}/maze.json"
rm data_lines.json
echo "Successfully generated maze"