<?php
use Doctrine\ORM\Tools\Setup;
require_once "vendor/autoload.php";
// Create a simple "default" Doctrine ORM configuration for XML Mapping
$isDevMode = true;
$config = Setup::createAnnotationMetadataConfiguration(array(__DIR__."/src"), $isDevMode);
// or if you prefer yaml or annotations
//$config = Setup::createXMLMetadataConfiguration(array(__DIR__."/config/xml"), $isDevMode);
//$config = Setup::createYAMLMetadataConfiguration(array(__DIR__."/config/yaml"), $isDevMode);
// database configuration parameters
$conn = array(
    'driver' => 'pdo_sqlite',
    'path' => '/var/sqlite/adfc/unfalldaten.sqlite',
);

if (file_exists(dirname(__FILE__) . '/local.settings.php')) {
  include dirname(__FILE__) . '/local.settings.php';
};
// obtaining the entity manager
$entityManager = \Doctrine\ORM\EntityManager::create($conn, $config);
