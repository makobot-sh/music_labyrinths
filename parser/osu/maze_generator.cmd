cd ..\..\mazegenerator\src
make
.\mazegen -w 30 -h 30
cd ..\..\parser\osu
python ..\svg_parser.py
copy data_lines.json "%1\maze.json"
del ..\data_lines.json
echo "Successfully generated maze"