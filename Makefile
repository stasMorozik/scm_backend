build_core_test:
	docker build -f Dockerfile.core.test ./  -t core_test
core_test:
	docker run --rm --name core_test -v $(CURDIR)/packages/core/__tests__:/app/packages/core/__tests__ core_test
build_postgresql_adapters_test:
	docker build -f Dockerfile.postgresql-adapters.test ./  -t postgresql_adapters_test
postgresql_adapters_test:
	docker run --rm --name postgresql_adapters_test -v $(CURDIR)/packages/postgresql-adapters/__tests__:/app/packages/postgresql-adapters/__tests__ postgresql_adapters_test
build_http_adapters_test:
	docker build -f Dockerfile.http-adapters.test ./  -t http_adapters_test
http_adapters_test:
	docker run --rm --name http_adapters_test -v $(CURDIR)/packages/http-adapters/__tests__:/app/packages/http-adapters/__tests__ http_adapters_test
build_api:
	docker build -f Dockerfile.api ./  -t api
run_api:
	docker run --network host --rm -it --name api -v $(CURDIR)/packages/api/app.js:/app/packages/api/app.js -v $(CURDIR)/packages/api/src/:/app/packages/api/src/ api
build_websocket_devices:
	docker build -f Dockerfile.websocket-devices ./  -t websocket_devices
run_websocket_devices:
	docker run --network host --rm -it --name websocket_devices -v $(CURDIR)/packages/websocket-devices/app.js:/app/packages/websocket-devices/app.js -v $(CURDIR)/packages/websocket-devices/src/:/app/packages/websocket-devices/src/ websocket_devices
build_websocket_admin:
	docker build -f Dockerfile.websocket-admin ./  -t websocket_admin
run_websocket_admin:
	docker run --network host --rm -it --name websocket_admin -v $(CURDIR)/packages/websocket-admin/app.js:/app/packages/websocket-admin/app.js -v $(CURDIR)/packages/websocket-admin/src/:/app/packages/websocket-admin/src/ websocket_admin
build_devices_notifier_service:
	docker build -f Dockerfile.devices-notifier-service ./  -t devices_notifier_service
run_devices_notifier_service:
	docker run --network host --rm -it --name devices_notifier_service -v $(CURDIR)/packages/devices-notifier-service/app.js:/app/packages/devices-notifier-service/app.js -v $(CURDIR)/packages/devices-notifier-service/src/:/app/packages/devices-notifier-service/src/ devices_notifier_service