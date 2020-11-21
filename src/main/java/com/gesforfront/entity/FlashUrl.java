
package com.gesforfront.entity;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "flash")
public class FlashUrl {
    
    @Value("${flash.url.external.f}")
    private String urlExternalFront;
    
    @Value("${flash.url.external.b}")
    private String urlExternalBack;
    
    @Value("${flash.url.local.f}")
    private String urlLocalFront;
    
    @Value("${flash.url.local.b}")
    private String urlLocalBack;

    /**
     * @return the urlExternalFront
     */
    public String getUrlExternalFront() {
        return urlExternalFront;
    }

    /**
     * @param urlExternalFront the urlExternalFront to set
     */
    public void setUrlExternalFront(String urlExternalFront) {
        this.urlExternalFront = urlExternalFront;
    }

    /**
     * @return the urlExternalBack
     */
    public String getUrlExternalBack() {
        return urlExternalBack;
    }

    /**
     * @param urlExternalBack the urlExternalBack to set
     */
    public void setUrlExternalBack(String urlExternalBack) {
        this.urlExternalBack = urlExternalBack;
    }

    /**
     * @return the urlLocalFront
     */
    public String getUrlLocalFront() {
        return urlLocalFront;
    }

    /**
     * @param urlLocalFront the urlLocalFront to set
     */
    public void setUrlLocalFront(String urlLocalFront) {
        this.urlLocalFront = urlLocalFront;
    }

    /**
     * @return the urlLocalBack
     */
    public String getUrlLocalBack() {
        return urlLocalBack;
    }

    /**
     * @param urlLocalBack the urlLocalBack to set
     */
    public void setUrlLocalBack(String urlLocalBack) {
        this.urlLocalBack = urlLocalBack;
    }
    
    
}
