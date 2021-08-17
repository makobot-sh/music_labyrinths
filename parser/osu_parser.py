import json
import re
import zipfile
import sys
import os

filePath = sys.argv[1]

def detectDifficulty(filename):
	return filename.split("[")[1].split("]")[0]

if __name__ == "__main__":
	id = os.path.basename(filePath)[0:6]

	print("Uncompressing OSU! beatmap...")
	extractionPath = "../beatmaps/"+id
	if (os.path.exists(extractionPath) and os.path.isdir(extractionPath)):
		print("Beatmap with same id already uncompressed - skipping uncompression")
	else:
		with zipfile.ZipFile(filePath, 'r') as zip_ref:
			zip_ref.extractall("../beatmaps/"+id)

	availableFiles = []
	difficulties = []
	for file in os.listdir(extractionPath):
		if (file.endswith(".osu")):
			availableFiles.append(file)
			difficulties.append(detectDifficulty(file))
	
	#with open(extractionPath + ) as file:
	#	data = file.read()
	i = 1
	print("Available difficulty levels:")
	for d in difficulties:
		print("{}. {}".format(i,d))
		i+=1

	valid = False
	while(not valid):
		try:	 
			n1 = int(input('Select difficulty (input index number): '))
			if(n1 < 1 or n1 > len(difficulties)):
				print("Input must be a number between 1 and {}".format(len(difficulties)))
			else:
				valid = True
		except ValueError:
			print("Input must be a valid integer")
	print("Selected {} difficulty".format(difficulties[n1-1].lower()))

	osuFilename = availableFiles[n1-1]
	osuFilePath = os.path.join(extractionPath, availableFiles[n1-1])
	
	times = []
	with open(osuFilePath) as file:
		lines = file.readlines()
		skip = True
		for line in lines:
			if(skip and line.strip() == "[HitObjects]"):
				skip = False
			elif (not skip):
				time = line.split(",")[2]
				times.append(time)

	print("Generating song .json...")
	dataset = {"times":times}
	jsonpath = os.path.join(extractionPath, osuFilename.replace(".osu",".json"))
	with open(jsonpath, 'w', encoding='utf-8') as f:
		json.dump(dataset, f, ensure_ascii=False, indent=4)

	print("Done!")