import sys
import os

#    with open(osuFilePath) as file:
#		lines = file.readlines()
#       for line in lines:

class OsuReader:

    classSep = {
        "General": ": ",
        "Editor": ": ",
        "Metadata": ":",
        "Difficulty": ":",
        "Colours": " : ",
    }

    def __init__(self, path):
        self.path = path
        self.readIndex = 0
        self.parsedDict = {}
        self.checkVersion()

    #Parse the file in path "self.path" to a dictionary. The returned dictionary's keys are its sections
    def parseFile(self):
        self.parseSection("General")
        self.parseSection("Editor")
        self.parseSection("Metadata")
        self.parseSection("Difficulty")
        self.parseSection("TimingPoints")
        self.parseSection("Colours")
        self.parseSection("HitObjects")
        return self.parsedDict

    #Parse section named "title"
    def parseSection(self, title):
        self.advanceTo(f"[{title}]") 
        if (title == "TimingPoints"):
            self.parsedDict[title] = self.parseTimingPoints()
        elif (title == "HitObjects"):
            self.parsedDict[title] = self.parseHitObjects()
        else:
            self.parsedDict[title] = self.parsePairsSection(self.classSep[title])
    
    #Advance readIndex to the line following "sectionStartLine"
    def advanceTo(self, sectionStartLine):
        with open(self.path, 'r', encoding="utf-8") as file:
            for i, line in enumerate(file):
                if(i < self.readIndex):
                    continue
                if(line.strip() == sectionStartLine):
                    self.readIndex = i+1
                    break
    
    # Parse section with content format: "key: value" pairs
    def parsePairsSection(self, sep):
        dict = {}
        with open(self.path, 'r', encoding="utf-8") as file:
            for i, line in enumerate(file):
                if(i < self.readIndex):
                    continue
                if(line.strip() == '' or line.strip().startswith("[")):
                    break
                pLine = line.strip().split(sep,1)
                dict[pLine[0]] = pLine[1]
        return dict

    def parseTimingPoints(self):
        bpmsSet = []
        with open(self.path, 'r', encoding="utf-8") as file:
            for i, line in enumerate(file):
                if(i < self.readIndex):
                    continue
                if(line.strip() == '' or line.strip().startswith("[")):
                    break
                pLine = line.strip().split(",")
                bpmsSet.append({"start": int(pLine[0]), "beatLen": float(pLine[1])})
        return bpmsSet

    def parseHitObjects(self):
        times = []
        with open(self.path, 'r', encoding="utf-8") as file:
            for i, line in enumerate(file):
                if(i < self.readIndex):
                    continue
                if(line.strip() == '' or line.strip().startswith("[")):
                    break
                pLine = line.strip().split(",")
                times.append(int(pLine[2]))
        return times

    def checkVersion(self):
        with open(self.path, 'r', encoding="utf-8") as file:
            version = file.readline().strip().split(" ")[-1]
            if(version != "v14"):
                print(f"[WARNING] File is of osu file format {version}, parser is made to support v14. Compatibility with other versions not guaranteed.")

if __name__ == "__main__":
    if(len(sys.argv) < 2):
        print("Error! Missing arguments")
        print("Usage: python3 osu_reader.py <.osu file path>")
        exit(1)

    filePath = sys.argv[1]

    if(not os.path.isfile(filePath)):
        print("Error! Invalid path or file")
        print("Usage: python3 osu_parser.py <.osz file path>")
        exit(1)

    reader = OsuReader(filePath)
    osuDict = reader.parseFile()
    print(osuDict)