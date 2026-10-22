#!/bin/sh
# Uso: sh revisar.sh seedN  -> lanza Whisper sobre la tanda y enseña lo reconocido
D=$(dirname "$0"); JOB=$(cat "$D/$1/job.txt"); TOK=$(cat /c/Herramientas/local-voice-studio/data/api-token)
curl -s -m 30 -X POST -H "X-Local-Token: $TOK" -H "Content-Type: application/json" -d '{}' http://127.0.0.1:7860/api/jobs/$JOB/review >/dev/null
for i in $(seq 1 40); do s=$(curl -s -H "X-Local-Token: $TOK" http://127.0.0.1:7860/api/jobs/$JOB | grep -o '"review_status":"[a-z]*"'); case "$s" in *completed*|*failed*) break;; esac; sleep 5; done
curl -s -H "X-Local-Token: $TOK" http://127.0.0.1:7860/api/jobs/$JOB/files/subtitles-asr.srt
