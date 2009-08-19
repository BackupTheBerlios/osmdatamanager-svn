#
# Tabellenstruktur für Tabelle `tab_file`
#

DROP TABLE IF EXISTS `tab_file`;
CREATE TABLE `tab_file` (
  `usrid` int(11) NOT NULL default '0',
  `itemid` int(11) NOT NULL auto_increment,
  `path` varchar(255) NOT NULL default '',
  `filename` varchar(255) NOT NULL default '',
  `itemname` varchar(255) default NULL,
  `tagname` varchar(50) default NULL,
  `icon2` varchar(50) default NULL,
  `valid` int(11) default NULL,
  PRIMARY KEY  (`usrid`,`itemid`)
) TYPE=MyISAM AUTO_INCREMENT=1 ;

# --------------------------------------------------------

#
# Tabellenstruktur für Tabelle `tab_grp`
#

DROP TABLE IF EXISTS `tab_grp`;
CREATE TABLE `tab_grp` (
  `itemid` int(11) NOT NULL auto_increment,
  `usrid` int(11) NOT NULL default '0',
  `parentid` int(11) default NULL,
  `itemname` varchar(255) NOT NULL default '',
  `options` varchar(255) default NULL,
  `protection` varchar(20) default NULL,
  `zoomlevel` int(11) default NULL,
  `lat` varchar(50) default NULL,
  `lon` varchar(50) default NULL,
  `tagname` varchar(50) default NULL,
  `icon2` varchar(50) default NULL,
  PRIMARY KEY  (`itemid`)
) TYPE=MyISAM AUTO_INCREMENT=10 ;

# --------------------------------------------------------

#
# Tabellenstruktur für Tabelle `tab_grp_item`
#

DROP TABLE IF EXISTS `tab_grp_item`;
CREATE TABLE `tab_grp_item` (
  `usrid` int(11) NOT NULL default '0',
  `itemid` int(11) NOT NULL default '0',
  `childid` int(11) NOT NULL default '0',
  `itemtype` varchar(50) NOT NULL default '',
  PRIMARY KEY  (`itemid`,`childid`,`usrid`,`itemtype`)
) TYPE=MyISAM;

# --------------------------------------------------------

#
# Tabellenstruktur für Tabelle `tab_icon`
#

DROP TABLE IF EXISTS `tab_icon`;
CREATE TABLE `tab_icon` (
  `id` int(11) NOT NULL auto_increment,
  `tagname` varchar(50) NOT NULL default '',
  `icon1` varchar(50) NOT NULL default '',
  `icon2` varchar(50) default NULL,
  `icon3` varchar(50) default NULL,
  PRIMARY KEY  (`id`,`tagname`)
) TYPE=MyISAM AUTO_INCREMENT=6 ;

# --------------------------------------------------------

#
# Tabellenstruktur für Tabelle `tab_message`
#

DROP TABLE IF EXISTS `tab_message`;
CREATE TABLE `tab_message` (
  `id` int(11) NOT NULL auto_increment,
  `date` datetime NOT NULL default '0000-00-00 00:00:00',
  `loglevel` varchar(40) NOT NULL default '',
  `message` varchar(255) NOT NULL default '',
  PRIMARY KEY  (`id`)
) TYPE=MyISAM AUTO_INCREMENT=24829 ;

# --------------------------------------------------------

#
# Tabellenstruktur für Tabelle `tab_poi`
#

DROP TABLE IF EXISTS `tab_poi`;
CREATE TABLE `tab_poi` (
  `itemid` int(11) NOT NULL auto_increment,
  `usrid` int(11) NOT NULL default '0',
  `poitype` int(11) NOT NULL default '0',
  `itemname` varchar(40) NOT NULL default '',
  `description` text,
  `lat` varchar(50) NOT NULL default '',
  `lon` varchar(50) NOT NULL default '',
  `zoomlevel` int(11) default NULL,
  `tagname` varchar(50) default NULL,
  PRIMARY KEY  (`itemid`,`usrid`)
) TYPE=MyISAM AUTO_INCREMENT=103 ;

# --------------------------------------------------------

#
# Tabellenstruktur für Tabelle `tab_usr`
#

DROP TABLE IF EXISTS `tab_usr`;
CREATE TABLE `tab_usr` (
  `itemid` int(11) NOT NULL auto_increment,
  `itemname` varchar(20) NOT NULL default '',
  `password` varchar(50) NOT NULL default '',
  `email` varchar(50) NOT NULL default '',
  `homepage` varchar(50) default NULL,
  `description` varchar(255) default NULL,
  `picture` varchar(50) default NULL,
  `lat` varchar(50) default NULL,
  `lon` varchar(50) default NULL,
  `zoomlevel` int(11) default NULL,
  `admin` int(11) default NULL,
  `tagname` varchar(50) NOT NULL default '',
  PRIMARY KEY  (`itemid`)
) TYPE=MyISAM AUTO_INCREMENT=57 ;

# ------------------------------------------------------

INSERT INTO `tab_icon` ( `id` , `tagname` , `icon1` , `icon2` , `icon3` )
VALUES (
'', 'user', 'images/crystal_project/identity.png', NULL , NULL
);

INSERT INTO `tab_icon` ( `id` , `tagname` , `icon1` , `icon2` , `icon3` )
VALUES (
'', 'standard', 'images/crystal_project/folder.png', 'images/crystal_project/folder_open.png' , NULL
);

INSERT INTO `tab_icon` ( `id` , `tagname` , `icon1` , `icon2` , `icon3` )
VALUES (
'', 'standard_poi', 'images/crystal_project/flag.png', NULL , NULL
);

INSERT INTO `tab_icon` ( `id` , `tagname` , `icon1` , `icon2` , `icon3` )
VALUES (
'', 'file_gpx', 'images/crystal_project/runit.png', NULL , NULL
);











