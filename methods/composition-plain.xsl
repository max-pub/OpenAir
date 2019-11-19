<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" exclude-result-prefixes="xs" version="2.0">
    <xsl:output method="xml" encoding="UTF-8" indent="yes" omit-xml-declaration="yes"/>

    <xsl:template match="/composition">
        <h1>
            <xsl:value-of select="./name/value"/>
        </h1>
    </xsl:template>
    
</xsl:stylesheet>



