DROP TABLE IF EXISTS `tab_file`;
CREATE TABLE `tab_file` (
  `usrid` int(11) NOT NULL default '0',
  `path` varchar(255) NOT NULL default '',
  `filename` varchar(255) NOT NULL default '',
  `description` varchar(255) default NULL,
  PRIMARY KEY  (`usrid`,`filename`)
) TYPE=MyISAM;

DROP TABLE IF EXISTS `tab_grp`;
CREATE TABLE `tab_grp` (
  `grpid` int(11) NOT NULL auto_increment,
  `usrid` int(11) NOT NULL default '0',
  `prntgrp` int(11) default NULL,
  `grpname` varchar(255) NOT NULL default '',
  `options` varchar(255) default NULL,
  `protection` varchar(20) default NULL,
  `zoomlevel` int(11) default NULL,
  `lat` varchar(50) default NULL,
  `lon` varchar(50) default NULL,
  PRIMARY KEY  (`grpid`)
) TYPE=MyISAM AUTO_INCREMENT=197 ;


DROP TABLE IF EXISTS `tab_grp_file`;
CREATE TABLE `tab_grp_file` (
  `grpid` int(11) NOT NULL default '0',
  `usrid` int(11) NOT NULL default '0',
  `filename` varchar(255) NOT NULL default '',
  PRIMARY KEY  (`grpid`,`usrid`,`filename`)
) TYPE=MyISAM;

DROP TABLE IF EXISTS `tab_grp_poi`;
CREATE TABLE `tab_grp_poi` (
  `grpid` int(11) NOT NULL default '0',
  `usrid` int(11) NOT NULL default '0',
  `poiid` int(11) NOT NULL default '0',
  PRIMARY KEY  (`grpid`,`usrid`,`poiid`)
) TYPE=MyISAM;

DROP TABLE IF EXISTS `tab_message`;
CREATE TABLE `tab_message` (
  `id` int(11) NOT NULL auto_increment,
  `date` datetime NOT NULL default '0000-00-00 00:00:00',
  `loglevel` varchar(40) NOT NULL default '',
  `message` varchar(255) NOT NULL default '',
  PRIMARY KEY  (`id`)
) TYPE=MyISAM AUTO_INCREMENT=51826 ;


DROP TABLE IF EXISTS `tab_poi`;
CREATE TABLE `tab_poi` (
  `poiid` int(11) NOT NULL auto_increment,
  `usrid` int(11) NOT NULL default '0',
  `poitype` int(11) NOT NULL default '0',
  `poiname` varchar(40) NOT NULL default '',
  `description` text,
  `latlon` varchar(255) default NULL,
  `georssurl` varchar(255) default NULL,
  PRIMARY KEY  (`poiid`,`usrid`,`poiname`)
) TYPE=MyISAM AUTO_INCREMENT=82 ;


DROP TABLE IF EXISTS `tab_usr`;
CREATE TABLE `tab_usr` (
  `id` int(11) NOT NULL auto_increment,
  `username` varchar(20) NOT NULL default '',
  `password` varchar(50) NOT NULL default '',
  `email` varchar(50) NOT NULL default '',
  `homepage` varchar(50) default NULL,
  `location` varchar(50) default NULL,
  `abouthtml` varchar(255) default NULL,
  `picture` varchar(50) default NULL,
  PRIMARY KEY  (`id`)
) TYPE=MyISAM AUTO_INCREMENT=56 ;
