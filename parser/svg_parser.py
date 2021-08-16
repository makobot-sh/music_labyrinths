import json
import re

def get_svg_width(data):
	size_maze_width = re.search('width="[0-9]+"', data)
	width = re.findall("[0-9]+", size_maze_width.group())
	return width

def get_svg_height(data):
	size_maze_height = re.search('height="[0-9]+"', data)
	height = re.findall("[0-9]+", size_maze_height.group())
	return height

def get_svg_lines(data):
	points = re.findall('[0-9]+\.[0-9]+', data)
	#Divide the points in segments of four elements
	#(x1, x2, y1, y2)
	lines_with_points = [points[i:i + 4] for i in range(0, len(points), 4)]
	return lines_with_points

def convert_lines_to_dictionary(data_set):
	for i in range(0, len(lines_with_points)):
		string = "Line" + str(i + 1)
		aux = {}
		aux["x1"] = lines_with_points[i][0]
		aux["x2"] = lines_with_points[i][1]
		aux["y1"] = lines_with_points[i][2]
		aux["y2"] = lines_with_points[i][3]
		data_set[string] = aux
	return data_set

if __name__ == "__main__":
	data = []
	print("Reading SVG file...")
	with open('../mazegenerator/src/maze.svg') as file:
		data = file.read()


	height = get_svg_height(data)
	width  = get_svg_width(data)


	lines_with_points = get_svg_lines(data)

	data_set = {"Height" : height[0], "Width" : width[0]}
	data_set = convert_lines_to_dictionary(data_set)
	print("Converting to JSON...")
	with open('data_lines.json', 'w', encoding='utf-8') as f:
		json.dump(data_set, f, ensure_ascii=False, indent=4)
	print("Done!")


	