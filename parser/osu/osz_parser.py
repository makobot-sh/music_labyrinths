import json
import zipfile
import sys
import os
import shutil
import osu_reader

beatmapsFolder = "../../beatmaps"

def detectDifficulty(filename):
	return filename.split("[")[1].split("]")[0]

def selectDifficulty(difficulties):
	while(True):
		try:	 
			n1 = int(input('Select difficulty (input index number): '))
			if(n1 >= 1 and n1 < len(difficulties)):
				break
			else:
				print("Input must be a number between 1 and {}".format(len(difficulties)))
		except ValueError:
			print("Input must be a valid integer")
	print("Selected {} difficulty".format(difficulties[n1-1].lower()))
	return n1

def unzipOsz(extractionPath):
	try:
		with zipfile.ZipFile(filePath, 'r') as zip_ref:
			zip_ref.extractall(extractionPath)
	except Exception as e:
		print("Failed to unzip with error: {}".format(e))
		exit(1)

def updateMapsIndex():
	availableMaps = []
	for file in os.listdir(beatmapsFolder):
		d = os.path.join(beatmapsFolder, file)
		if os.path.isdir(d):
			availableMaps.append(file)
	
	indexPath = os.path.join(beatmapsFolder, "maps_index.json")
	with open(indexPath, 'w', encoding='utf-8') as f:
		json.dump(availableMaps, f, ensure_ascii=False, indent=4)
	

if __name__ == "__main__":
	if(len(sys.argv) < 2):
		print("Error! Missing arguments")
		print("Usage: python3 osu_parser.py <.osz file path>")
		exit(1)

	filePath = sys.argv[1]

	if(not os.path.isfile(filePath)):
		print("Error! Invalid path or file")
		print("Usage: python3 osu_parser.py <.osz file path>")
		exit(1)

	id = os.path.basename(filePath)[0:6].strip()

	print("Uncompressing OSU! beatmap...")
	extractionPath = f"{beatmapsFolder}/temp"

	unzipOsz(extractionPath)

	availableFiles = []
	difficulties = []
	for file in os.listdir(extractionPath):
		if (file.endswith(".osu")):
			availableFiles.append(file)
			difficulties.append(detectDifficulty(file))
	
	print("Available difficulty levels:")
	for i, d in enumerate(difficulties, 1):
		print("{}. {}".format(i,d))

	n1 = selectDifficulty(difficulties)

	osuFilename = availableFiles[n1-1]
	osuFilePath = os.path.join(extractionPath, availableFiles[n1-1])
	
	reader = osu_reader.OsuReader(osuFilePath)
	osuDict = reader.parseFile()
	times = osuDict["HitObjects"]
	audioFilename = osuDict["General"]["AudioFilename"]
	bpmsSet = osuDict["TimingPoints"]
	#Include song's last hitpoint as a bpm with beatLen 0 in bpms json.
	bpmsSet.append({"start": int(times[-1]), "beatLen": 0})

	cleanTitle = ''.join(e for e in osuDict["Metadata"]["Title"] if (e.isalnum() or e == ' '))
	newFilePrefix = "{} - {}".format(cleanTitle, osuDict["Metadata"]["Version"])
	newFilesPath = f"{beatmapsFolder}/{newFilePrefix}"
	if not os.path.exists(newFilesPath):
		os.makedirs(newFilesPath)

	print("Generating song information .json files...")
	timesJsonPath = os.path.join(newFilesPath, "{}_times.json".format(newFilePrefix))
	with open(timesJsonPath, 'w', encoding='utf-8') as f:
		json.dump(times, f, ensure_ascii=False, indent=4)
	
	bpmJsonPath = os.path.join(newFilesPath, "{}_bpms.json".format(newFilePrefix))
	with open(bpmJsonPath, 'w', encoding='utf-8') as f:
		json.dump(bpmsSet, f, ensure_ascii=False, indent=4)

	audioExt = audioFilename.split(".")[-1]
	audioFilePath = os.path.join(extractionPath, audioFilename)
	copyFilePath = os.path.join(newFilesPath, "{}_audio.{}".format(newFilePrefix, audioExt))
	shutil.copyfile(audioFilePath, copyFilePath)
	
	shutil.rmtree(extractionPath)

	updateMapsIndex()

	print("Done!")