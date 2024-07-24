RELEASE_ROOT=../RELEASE
CUR_RELEASE=s4i-xapi-demo-v1.02
RELEASE_DIR=$(RELEASE_ROOT)/$(CUR_RELEASE)

xapi-demo:
	@echo "Building XAPI Demo..."
	mkdir -p xapi-demo
	parcel build ./web/index.html --public-url /xapi-demo --dist-dir xapi-demo
run:
	parcel ./web/index.html
release:
	rm -fr $(RELEASE_DIR)
	mkdir -p $(RELEASE_DIR)
	cp -fr ../README.MD $(RELEASE_DIR)
	cp -fr cli $(RELEASE_DIR)
	cp -fr web $(RELEASE_DIR)
	cp -fr xapi $(RELEASE_DIR)
	cp -fr run-parcel.sh $(RELEASE_DIR)
	cp -fr run-parcel.bat $(RELEASE_DIR)
	cd $(RELEASE_ROOT); zip -r $(CUR_RELEASE).zip $(CUR_RELEASE) -x .*.*
clean:
	@echo "Cleaning XAPI Demo..."
	rm -fr ./xapi-demo
	rm -fr ../$(RELEASE_DIR)

