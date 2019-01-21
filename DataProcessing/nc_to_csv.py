import netCDF4 as nc
import csv
import os
import sys


try:
    inputPath = sys.argv[1]
    time = int(sys.argv[2])
    variableNameList = sys.argv[3].split(",")
    outputPath = sys.argv[4]
except:
    print("arguments help: <input_path> <time> <variable_name1,variable_name2...> <output_path>")
    exit()

for fileName in os.listdir(inputPath):
    try:
        data = nc.Dataset(inputPath + "/" + fileName)
        print("Processing file " + fileName + "...")
        
        v = data.variables
        d = data.dimensions
        
        dLatSize = d["south_north"].size
        dLonSize = d["west_east"].size

        variableInTimeList = list()
        for n in variableNameList:
            variableInTimeList.append(v[n][time])

        ls = list()
        sys.stdout.write("\rDone 0/" + str(dLatSize))
        sys.stdout.flush()
        for lat in range(dLatSize):
            variableInLatitudeList = list()
            for d in variableInTimeList:
                variableInLatitudeList.append(d[lat])
            for lon in range(dLonSize):
                o = {"time" : time, "latitude" : lat, "longitude" : lon}
                for i in range(len(variableNameList)):
                    o[variableNameList[i]] = variableInLatitudeList[i][lon]
                    
                #print(o)
                ls.append(o)
            sys.stdout.write("\rDone " + str(lat + 1) + "/" + str(dLatSize))
            sys.stdout.flush()
        print("")

        os.makedirs(outputPath, exist_ok = True)
        outputFilename = outputPath + "/" + fileName[10:20] + ".csv"
        print("Writing to " + outputFilename + "...")
        with open(outputFilename, "w", newline = "") as outFile:
            writer = csv.DictWriter(outFile, fieldnames = ls[0].keys())
            writer.writeheader()
            writer.writerows(ls)
        print("Write completed.")
    except OSError:
        continue

print("done")