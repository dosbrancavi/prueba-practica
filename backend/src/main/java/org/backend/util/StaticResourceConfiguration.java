package org.backend.util;

import io.quarkus.runtime.StartupEvent;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.StaticHandler;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Singleton; 

@Singleton
public class StaticResourceConfiguration {

    void setupStaticResources(@Observes StartupEvent event, Router router) {
        router.route("/tasksImages/*").handler(StaticHandler.create("tasksImages/"));
    }
}
