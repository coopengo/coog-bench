from node:8-alpine

RUN addgroup -S -g 1306 coog && adduser -S -u 1306 -G coog coog

USER coog

COPY --chown=coog:coog coog-bench /coog-bench
WORKDIR /coog-bench

COPY --chown=coog:coog ep /
ENTRYPOINT /ep
