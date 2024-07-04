export APP_NAME = arexa-trader-view

pm2-start:
	yarn build && pm2 start ecosystem.config.js --env production

pm2-cron-start:
	yarn build && pm2 start pm2.cron.config.js --env production

pm2-restart:
	pm2 restart ecosystem.config.js --env production

docker-local-up:
	docker compose -f  docker/docker-compose.local.yml up -d

docker-local-down:
	docker compose -f  docker/docker-compose.local.yml down
docker-local-down-v:
	docker compose -f  docker/docker-compose.local.yml down -v

docker-local-config:
	docker compose -f  docker/docker-compose.local.yml config

docker-prod-up:
	docker compose -f  docker/docker-compose.prod.yml up -d

docker-prod-down:
	docker compose -f  docker/docker-compose.prod.yml down

docker-prod-down-v:
	docker compose -f  docker/docker-compose.prod.yml down -v

docker-prod-config:
	docker compose -f  docker/docker-compose.prod.yml config

module-create:
	yarn nest g module modules/${name}
	yarn nest g controller modules/${name} --no-spec
	yarn nest g service modules/${name} --no-spec
	yarn nest g class modules/${name}/entities/${name}.entity --no-spec --flat
	yarn nest g class modules/${name}/dtos/${name}-response.dto --no-spec --flat
	yarn nest g class modules/${name}/dtos/${name}-request.dto --no-spec --flat

eslint:
	npx eslint "{src,apps,libs,test}/**/*.ts" --fix

worker:
	yarn worker
