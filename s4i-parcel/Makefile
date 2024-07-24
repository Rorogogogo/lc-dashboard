PARCEL-NAMER-REWRITE-PROFILE=production
ERCO_SRC_PATH="/Users/steven/Documents/dev/s4i-office/ERCO/ERCO Sydney 2022"
xapi:
	@echo "Building XAPI App..."
	parcel build ./src/prj/xapi/xapi.html --dist-dir dist/xapi
ib:
	@echo "Building IB Admin App..."
	parcel build ./src/prj/ib/ib.html --dist-dir dist/ib

camera:
	@echo "Building Cameras App..."
	parcel build ./src/prj/camera/camera.html  --no-optimize --dist-dir dist/camera

portal:
	@echo "Building IB Web Portal App..."
	parcel build ./src/prj/portal/portal.html --dist-dir dist/portal

spyrides:
	@echo "Building Home Control App..."
	parcel build ./src/prj/spyrides/spyrides.html --dist-dir dist/spyrides
demo:
	@echo "Building Home Control App..."
	parcel build ./src/prj/demo/demo.html --dist-dir dist/demo
erco: 
	rm -fr $(ERCO_SRC_PATH)/erco-html5.zip
	cd $(ERCO_SRC_PATH)/Default; zip -x .*.* -r ../erco-html5.zip .
	scp $(ERCO_SRC_PATH)/erco-html5.zip admin@192.168.101.203:/Users/admin/Downloads 
	ssh -t admin@192.168.101.203 "cd /Users/admin/Downloads && unzip erco-html5.zip -d erco&& sudo rm -fr /opt/s4i/ib/.app/wwwroot/erco && sudo cp -fr erco /opt/s4i/ib/.app/wwwroot"
clean:
	@echo "Cleaning XAPI App..."
	rm -rf .parcel-cache
	rm -fr ./dist

all: xapi ib spyrides demo erco

