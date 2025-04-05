ROOT_DIR:=$(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
all: test
all: vet
all: package
all: package_race
run: run

test: vet
test: base_test
test: staticcheck
test: shadow


base_test:
	go test ./... -v

vet:
	go vet ./...

staticcheck: staticcheck_bin
	bin/staticcheck ./...

staticcheck_bin:
	GOBIN=${ROOT_DIR}/bin go install honnef.co/go/tools/cmd/staticcheck@latest

shadow: shadow_bin
	bin/shadow ./...

shadow_bin:
	GOBIN=${ROOT_DIR}/bin go install golang.org/x/tools/go/analysis/passes/shadow/cmd/shadow@latest

package: attendify

package_race: attendify_race

run: run

attendify:
	go build -o ./bin/attendify ./cmd/attendify/

attendify_race:
	go build --race -o ./bin/attendify_race ./cmd/attendify/

run:
	./bin/attendify_race
