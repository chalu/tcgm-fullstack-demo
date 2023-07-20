#!/usr/bin/env bash

find ../sdk/model/ -type f -exec sed -i '' 's/import/import type/g' {} \;