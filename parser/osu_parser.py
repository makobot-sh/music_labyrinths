import json
import zipfile
import sys
import os

def detectDifficulty(filename):
	return filename.split("[")[1].split("]")[0]

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
	extractionPath = "../beatmaps/"+id

	if (os.path.exists(extractionPath) and os.path.isdir(extractionPath)):
		print("Beatmap with same id already uncompressed - skipping uncompression")
	else:
		try:
			with zipfile.ZipFile(filePath, 'r') as zip_ref:
				zip_ref.extractall("../beatmaps/"+id)
		except Exception as e:
			print("Failed to unzip with error: {}".format(e))
			exit(1)

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
	
	bpmsSet = []
	times = []
	with open(osuFilePath) as file:
		lines = file.readlines()
		parseBPMS = False
		parseHitObjects = False
		for line in lines:
			if(parseBPMS):
				if(line.strip() == ""):
					# timingPoints section ended, go back to not parsing BPMs state
					parseBPMS = False
				else:
					bpm = line.split(",")
					bpmsSet.append({"start": int(bpm[0]), "beatLen": float(bpm[1])})
			elif(parseHitObjects):
				# parseHitObjects never goes back to false because the file ends 
				# when hitpoints section ends
				time = line.split(",")[2]
				times.append(int(time))
			elif(line.strip() == "[TimingPoints]"):
				parseBPMS = True
			elif(line.strip() == "[HitObjects]"):
				parseHitObjects = True
	
	#Include song's last hitpoint as a bpm with beatLen 0 in bpms json.
	bpmsSet.append({"start": int(times[-1]), "beatLen": 0})

	print("Generating song information .json files...")
	timesJsonPath = os.path.join(extractionPath, "{}_times_{}.json".format(id,difficulties[n1-1]))
	with open(timesJsonPath, 'w', encoding='utf-8') as f:
		json.dump(times, f, ensure_ascii=False, indent=4)
	
	bpmJsonPath = os.path.join(extractionPath, "{}_bpms_{}.json".format(id,difficulties[n1-1]))
	with open(bpmJsonPath, 'w', encoding='utf-8') as f:
		json.dump(bpmsSet, f, ensure_ascii=False, indent=4)


	print("Done!")