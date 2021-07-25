
import warnings

warnings.filterwarnings(
    "ignore",
    message="Multiple schemas resolved to the name "
)

from app import app

from api import *
from views import *

import os

if __name__ == "__main__":
    app.run()

