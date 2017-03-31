define(["dojo/_base/lang","dojo/_base/json","dojo/_base/url","dojo/cookie","dojo/Deferred","dojo/io-query","esri/IdentityManager"],function(e,r,i,o,t,n,s){var a={portal:"http://www.arcgis.com",init:function(r){e.mixin(this,r),this.portalUrl=this.portal+"/sharing/rest",this.checkOAuthResponse(window.location.href,!0),this.checkCookie(),this.overrideIdentityManager()},isSignedIn:function(){return!!s.findCredential(this.portalUrl)},signIn:function(){var e,r=this.deferred=new t,i={client_id:this.appId,response_type:"token",expiration:this.expiration};e=window.location.href.indexOf("?")>0?window.location.href.replace(/#.*$/,"")+"&":window.location.href.replace(/#.*$/,""),i.redirect_uri=e;var o=this.portal.replace(/^http:/i,"https:")+"/sharing/oauth2/authorize?"+n.objectToQuery(i);return window.location=o,r},signOut:function(){o("arcgis_auth",null,{expires:-1,path:"/",domain:document.domain}),window.location.reload()},checkOAuthResponse:function(e,i){var t=this.parseFragment(e);if(t)if(i&&(window.location.hash=""),t.error){var n=new Error(t.error);n.details=[t.error_description],this.deferred&&this.deferred.reject(n)}else{var s=this.registerToken(t);t.persist&&("localhost"===document.domain?o("arcgis_auth",r.toJson(t),{path:"/"}):o("arcgis_auth",r.toJson(t),{path:"/",domain:document.domain}),console.log("[Cookie] Write: ",o("arcgis_auth"))),this.deferred&&this.deferred.resolve(s)}},checkCookie:function(){var e=o("arcgis_auth");if(e){console.log("[Cookie] Read: ",e);var i=r.fromJson(e);this.registerToken(i)}},registerToken:function(e){s.registerToken({server:this.portalUrl,userId:e.username,token:e.access_token,expires:e.expires_at,ssl:e.ssl});var r=s.findCredential(this.portalUrl,e.username);return console.log("Token registered with Identity Manager: ",r),r},parseFragment:function(e){var r=new i(e),o=r.fragment?n.queryToObject(r.fragment):null;if(o)return o.access_token?(console.log("[OAuth Response]: ",o),o.expires_in=Number(o.expires_in),o.expires_at=(new Date).getTime()+1e3*o.expires_in,o.ssl="true"===o.ssl):o.error&&console.log("[OAuth Error]: ",o.error," - ",o.error_description),o},overrideIdentityManager:function(){var e=s.signIn,r=this;s.signIn=function(i,o,t){return o.server.indexOf(".arcgis.com")!==-1?r.signIn():e.apply(this,arguments)}}};return window.OAuthHelper=a,a});