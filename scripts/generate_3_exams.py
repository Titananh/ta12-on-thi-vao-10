import json
import os
import subprocess

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))
TS_OUTPUT_FILE = os.path.join(PROJECT_DIR, "src", "data", "exams_hk1.ts")
BO_DIR = os.path.join(PROJECT_DIR, "BO_TAI_LIEU_ON_THI_VAO_10")
HTML_OUTPUT_FILE = os.path.join(BO_DIR, "03_bo_3_de_kiem_tra_6_unit_dau.html")
PDF_OUTPUT_FILE = os.path.join(BO_DIR, "03_BO_3_DE_KIEM_TRA_6_UNIT_DAU_GLOBAL_SUCCESS_9.pdf")

# Read from a dedicated generator module or define the structured exams
print("Generating full exam suite for Units 1-6...")
