<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:x="http://schemas.openehr.org/v1"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" exclude-result-prefixes="xs" version="2.0">
    <xsl:output method="html" encoding="UTF-8" indent="yes" omit-xml-declaration="yes"/>
    <xsl:template match="/x:composition">
        <style>
        .meta{color: gray; font-size: 10px;}
        .archetype{color: gray; margin:0 auto;}
        .uid{color: gray;}
        input{width: 250px; height: 30px;}
        div.meta{display: inline-block;margin-left: 10px;}
        details{margin-top: 1rem; margin-left: 2rem; border-left: 1px dotted gray;}
        .input{margin-left: 2rem; font-size: 15px; font-weight: 100;} 
        .input div { display: inline-block; white-space: nowrap; }
        h1,h2{text-align:left;}
        .title{color: white;}
        table{margin-left: 2rem;}
        td{border: 1px solid #333;}
        td{border: none;}
        .uid{ padding: 1rem; font-size: 15px; text-align: middle}
        .aid{ padding: 1rem; font-size: 15px; text-align: middle; color: gray;}
        .type{ padding: 1rem; font-size: 15px; text-align: middle; color: silver;}
        </style>
        <h1>
            <span class='title'>
                <xsl:value-of select="./x:archetype_details/x:template_id/x:value"/>
            </span>
            <span class='uid'>
                <xsl:value-of select="./x:uid/x:value"/>
            </span>
        </h1>
        <details open='true'>
            <summary>
                <span class='title'>
                    <xsl:value-of select="./x:name/x:value"/>
                </span>
                <span class='aid'>
                    <xsl:value-of select="./x:archetype_details/x:archetype_id/x:value"/>
                </span>
                <span class='type'>
                    COMPOSITION
                </span>
            </summary>
            <xsl:apply-templates/>
        </details>
        <center>
            <button on-tap='bubbleUp' event='save'>save</button>
            <button on-tap='bubbleUp' event='delete'>delete</button>
        </center>
    </xsl:template>
    <xsl:template match="*[@archetype_node_id]">
        <details class="level_{count(ancestor::*)}" open='true' archetype_node_id='{@archetype_node_id}'>
            <summary >
                <span class='title'>
                    <xsl:value-of select="./x:name/x:value"/>
                </span>
                <span class='aid'>
                    <xsl:value-of select="@archetype_node_id"/>
                </span>
                <span class='type'>
                    <xsl:value-of select="@xsi:type"/>
                </span>
            </summary>
            <table>
                <xsl:apply-templates select='*[@archetype_node_id][./x:value]'/>
            </table>
            <xsl:apply-templates select='*[@archetype_node_id][not(./x:value)]'/>
        </details>
    </xsl:template>
    <xsl:template match="*[@archetype_node_id][./x:value]">
        <tr class="input">
            <td class='title'>
                <xsl:value-of select="./x:name/x:value"/>
            </td>
            <td class='aid'>
                <xsl:value-of select="@archetype_node_id"/>
            </td>
            <td class='input'>
                <xsl:choose>
                    <xsl:when test="./x:value/@xsi:type='DV_IDENTIFIER'">
                        <input archetype_node_id='{@archetype_node_id}' value='{./x:value/x:id}'/>
                    </xsl:when>
                    <xsl:otherwise>
                        <input  archetype_node_id='{@archetype_node_id}' value='{./x:value/x:value}'/>
                    </xsl:otherwise>
                </xsl:choose>
            </td>
            <td class='type'>
                <xsl:value-of select="./x:value/@xsi:type"/>
            </td>
        </tr>
    </xsl:template>
    <xsl:template match='*'></xsl:template>
</xsl:stylesheet>



