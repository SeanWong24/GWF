import csv
import os
import numpy as np
import matplotlib.pyplot as plt
import sys

try:
    inputPath = sys.argv[1]
    outputPath = sys.argv[2]
except:
    print("arguments help: <input_path> <output_path>")
    exit()

def getFieldIndex(headers, fieldName):
    return headers.index(fieldName)

for fileName in os.listdir(inputPath):
    with open(inputPath + "/" + fileName, "r") as outFile:
        reader = csv.reader(outFile)
        ls = list(reader)

        headers = ls.pop(0)

        latList = list()
        i = getFieldIndex(headers, "latitude")
        for item in ls:
            latList.append(item[i])

        lonList = list()
        i = getFieldIndex(headers, "longitude")
        for item in ls:
            lonList.append(item[i])

        for i in range(3, len(headers)):
            varList = list()
            varName = headers[i]
            for item in ls:
                varList.append(item[i])
            fileOutputPath = outputPath + "/" + fileName.split(sep = ".")[0].replace("-", "/")
            os.makedirs(fileOutputPath, exist_ok = True)
            plt.contourf(np.reshape(varList, (699, 639)))
            plt.axis('off')
            plt.subplots_adjust(left=0, right=1, top=1, bottom=0)
            plt.savefig(fileOutputPath + "/" + varName + ".png", dpi=1000)
            plt.close()