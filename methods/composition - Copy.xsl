<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:x="http://schemas.openehr.org/v1"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" exclude-result-prefixes="xs" version="2.0">
    <xsl:output method="xml" encoding="UTF-8" indent="yes" omit-xml-declaration="yes"/>
    <xsl:template match="/x:composition">
        <style>
        .meta{color: gray; font-size: 10px;}
        .archetype{color: gray; margin:0 auto;}
        .uid{color: gray;}
        input{width: 250px; height: 30px;}
        </style>
        <h1>
            <xsl:value-of select="./x:name/x:value"/>
        </h1>
        <center class='uid'>
            <xsl:value-of select="./x:uid/x:value"/>
        </center>
        <h2>
            <xsl:value-of select="./x:archetype_details/x:template_id/x:value"/>
        </h2>
        <center class='archetype'>
            <xsl:value-of select="./x:archetype_details/x:archetype_id/x:value"/>
        </center>
        <xsl:apply-templates select='.//x:content'/>
        <center>
            <button on-tap='bubbleUp' event='save'>save</button>
            <button on-tap='bubbleUp' event='delete'>delete</button>
        </center>
    </xsl:template>
    <xsl:template match="//x:content">
        <h3>
            <xsl:value-of select="./x:name/x:value"/>
        </h3>
        <center class='archetype'>
            <xsl:value-of select="@archetype_node_id"/>
        </center>
        <table id='{@archetype_node_id}'>
            <xsl:apply-templates select='.//x:items'/>
        </table>
    </xsl:template>
    <xsl:template match="//x:items">
        <tr>
            <td>
                <xsl:value-of select="./x:name/x:value"/>
            </td>
            <td class='meta'>
                <xsl:value-of select="@archetype_node_id"/>
                <br/>
                <xsl:value-of select="./x:value/@xsi:type"/>
            </td>
            <td class='input'>
                <xsl:choose>
                    <xsl:when test="./x:value/@xsi:type='DV_IDENTIFIER'">
                        <input value='{./x:value/x:id}'/>
                    </xsl:when>
                    <xsl:otherwise>
                        <input  id='{@archetype_node_id}' value='{./x:value/x:value}'/>
                    </xsl:otherwise>
                </xsl:choose>
            </td>
        </tr>
    </xsl:template>
</xsl:stylesheet>



